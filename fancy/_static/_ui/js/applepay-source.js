(function() {
    "use strict";
    // Duplicate detection
    if (window.FancyApplePay) {
        return;
    }

    const ApplePaySession = window.ApplePaySession || {
        STATUS_SUCCESS: true,
        STATUS_FAILURE: false,
        STATUS_INVALID_SHIPPING_POSTAL_ADDRESS: false
    };
    const StaticSelector =
        "#container-wrapper .apple-pay-button, #container-wrapper .apple-pay-button-with-text, #wrap .apple-pay-button, #wrap .apple-pay-button-with-text";
    const testShippingContact0 = {
        addressLines: ["12", "ADDRESS12-13"],
        administrativeArea: "New York",
        postalCode: "10012",
        locality: "New York",
        country: "United States",
        full_name: "ApplePay Test",
        phoneNumber: "",
        emailAddress: "anonymous@gmail.com"
    };
    const testShippingContact = {
        addressLines: ["12", "ADDRESS12-13"],
        administrativeArea: "New York",
        postalCode: "10012-1234",
        locality: "New York",
        country: "United States",
        full_name: "ApplePay Test",
        phoneNumber: "18005751234",
        emailAddress: "anonymous@gmail.com"
    };

    const BASIC_FAILURE_MESSAGE = "We failed to process your order. Please try again or contact cs@fancy.com";

    function handleInvalidAddress0(session, error) {
        try {
            session.completeShippingContactSelection(
                ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
                [],
                { label: FancyApplePay.label || "Fancy", amount: "0.01" },
                []
            );
        } catch (e) {
            console.trace(e);
            session.abort();
            alert(error || BASIC_FAILURE_MESSAGE);
            FancyApplePay.afterAbort();
        }
    }
    function handleInvalidAddress1(session, error) {
        try {
            session.completeShippingMethodSelection(
                ApplePaySession.STATUS_INVALID_SHIPPING_POSTAL_ADDRESS,
                { label: FancyApplePay.label || "Fancy", amount: "0.01" },
                []
            );
        } catch (e) {
            console.trace(e);
            session.abort();
            alert(error || BASIC_FAILURE_MESSAGE);
            FancyApplePay.afterAbort();
        }
    }

    function buildAddressString(contact) {
        const address = {};
        try {
            if (location.args.log) {
                console.log("CONTACT", JSON.stringify(contact));
            }
        } catch (err) {
            console.trace(err);
        }
        address.address1 = contact.addressLines ? contact.addressLines.join(" ") : "ADDRESS 1";
        address.state = contact.administrativeArea;
        address.zip = contact.postalCode;
        address.city = contact.locality;
        address.country = contact.countryCode || contact.country;
        address.phone = contact.phoneNumber;

        if (contact.givenName && contact.familyName) {
            address.full_name = contact.givenName + " " + contact.familyName;
        } else {
            address.full_name = contact.givenName || contact.familyName;
        }

        address.alias = address.city + " " + address.zip;

        return JSON.stringify(address);
    }

    // function buildBillingAddressString(billingAddr) {
    //     const address = {};
    //     address.address1 = billingAddr.address_line1;
    //     address.address2 = billingAddr.address_line2;
    //     address.city = billingAddr.address_city;
    //     address.state = billingAddr.address_state;
    //     address.zip = billingAddr.address_zip;
    //     address.country = billingAddr.country;
    //     address.alias = address.city+" "+address.zip;

    //     return JSON.stringify(address);
    // }

    function isPositive(value) {
        return parseFloat(value) > 0;
    }

    function buildLineItems(json) {
        const lineItems = [];
        if (parseFloat(json.subtotal_prices) !== parseFloat(json.total_prices)) {
            lineItems.push({
                type: "final",
                label: "Item Total",
                amount: parseFloat(json.subtotal_prices).toFixed(2)
            });
        }
        if (isPositive(json.sales_taxes)) {
            lineItems.push({
                type: "final",
                label: "Tax",
                amount: parseFloat(json.sales_taxes).toFixed(2)
            });
        }
        if (isPositive(json.shipping_costs)) {
            lineItems.push({
                type: "final",
                label: "Shipping",
                amount: parseFloat(json.shipping_costs).toFixed(2)
            });
        }
        if (isPositive(json.credit_amount)) {
            lineItems.push({
                type: "final",
                label: (FancyApplePay.label || "Fancy") + " Rebate",
                amount: -parseFloat(json.credit_amount).toFixed(2)
            });
        }
        if (isPositive(json.fancy_money_amount)) {
            lineItems.push({
                type: "final",
                label: "Gift Card",
                amount: -parseFloat(json.fancy_money_amount).toFixed(2)
            });
        }
        if (isPositive(json.coupon_amount)) {
            lineItems.push({
                type: "final",
                label: "Coupon",
                amount: -parseFloat(json.coupon_amount).toFixed(2)
            });
        }
        if (isPositive(json.total_prices)) {
            lineItems.push({
                type: "final",
                label: FancyApplePay.label || "Fancy",
                amount: parseFloat(json.total_prices).toFixed(2)
            });
        } else {
            lineItems.push({
                type: "final",
                label: FancyApplePay.label || "Fancy",
                amount: 0.0
            });
        }
        return lineItems;
    }

    function payment(session, result, completionCallback) {
        // var billing_addr = "{}"
        // try {
        //     billing_addr = buildBillingAddressString(result.token.card)
        // } catch(err) {
        //     console.trace(err)
        // }
        const params = {
            payment_gateway: "6",
            applepay: "true",
            card_token: result.token.id,
            //"cartbust":true,
            email: result.shippingContact.emailAddress,
            shipping_addr: buildAddressString(result.shippingContact)
        };
        if ($(document.body).hasClass("mobile-web")) {
            params.ordered_via = "Mobile Web";
        }
        $.ajax({
            type: "POST",
            url: `/rest-api/v1/checkout/payment/${session.checkout.id}`,
            data: params
        })
            .done(({ error }) => {
                if (error) {
                    completionCallback(ApplePaySession.STATUS_FAILURE);
                    alert(BASIC_FAILURE_MESSAGE);
                    FancyApplePay.afterAbort();
                    /*
                if(session.is_express_checkout) {
                    //document.location.reload();
                } else {
                    document.location.href="/cart";
                }
                */
                } else {
                    completionCallback(ApplePaySession.STATUS_SUCCESS);
                    location.replace("/confirmation?wallet=" + (session.checkout.checkout_code || session.checkout.id));
                }
            })
            .fail((xhr, statusText, error) => {
                completionCallback(ApplePaySession.STATUS_FAILURE);
                alert(BASIC_FAILURE_MESSAGE);
                FancyApplePay.afterAbort();

                console.log("POST /rest-api/v1/checkout/payment failed", xhr, statusText);
                console.trace(error);
                /*
            if(session.is_express_checkout) {
                //document.location.reload();
            } else {
                document.location.href="/cart";
            }
            */
            });
    }

    function post_checkout(
        session,
        { option_id, quantity, sale_item_id, seller_id, shippingContact, sale_item_cart_id, giftcard }
    ) {
        const params = {
            applepay: "true",
            shipping_addr: buildAddressString(shippingContact),
            save_address: "false",
            available_only: "1",
            reset_shipping_option: "true"
        };
        if (sale_item_id) {
            var express = {
                sale_item_id: sale_item_id,
                quantity: quantity,
                seller_id: seller_id
            };
            if (option_id) {
                express["option_id"] = option_id;
            }

            if (giftcard) {
                for (var k in giftcard) {
                    express[k] = giftcard[k];
                }
            }

            params["express"] = JSON.stringify(express);
        }
        if (sale_item_cart_id) {
            params.sale_item_cart_id = sale_item_cart_id;
            params.express = true;
        }
        if (location.args.incomplete_address) {
            params["incomplete_address"] = "true";
        }
        console.log("params", params);

        $.ajax({
            type: "POST",
            url: "/rest-api/v1/checkout",
            data: params,
            success: function(json) {
                console.log("Checkout object", json);
                if (json.error) {
                    console.trace(json.error);
                    handleInvalidAddress0(session, json.error);
                    return;
                }
                try {
                    session.checkout = json;
                    var newShippingMethods = [];
                    var newTotal = {
                        label: FancyApplePay.label || "Fancy",
                        amount: parseFloat(json.total_prices).toFixed(2)
                    };
                    var newLineItems = buildLineItems(json);
                    var seller_ids = [];
                    for (seller_id in json.sale_items_freeze) {
                        var seller_items = json.sale_items_freeze[seller_id];
                        if (seller_items.checkout_available != true) {
                            var error_message = null;
                            for (var k in seller_items.items) {
                                var seller_item = seller_items.items[k];
                                if (seller_item.error_message) {
                                    error_message = seller_item.error_message;
                                    break;
                                }
                            }
                            handleInvalidAddress0(session, error_message);
                            return;
                        }

                        seller_ids.push(seller_id);
                    }
                    if (seller_ids.length === 1) {
                        // single seller
                        var seller_items = json.sale_items_freeze[seller_id];
                        if (seller_items.shipping_options && seller_items.shipping_options.length > 1) {
                            for (var i in seller_items.shipping_options) {
                                var shipping_option = seller_items.shipping_options[i];
                                newShippingMethods.push({
                                    label: shipping_option.label,
                                    detail: shipping_option.detail,
                                    amount: "" + shipping_option.amount,
                                    identifier: seller_id + ":" + shipping_option.id
                                });
                            }
                        }
                    }
                    session.completeShippingContactSelection(
                        ApplePaySession.STATUS_SUCCESS,
                        newShippingMethods,
                        newTotal,
                        newLineItems
                    );
                } catch (err) {
                    console.trace(err);
                    handleInvalidAddress0(session);
                }
            }
        }).fail(function(xhr, statusText, error) {
            console.log("POST /rest-api/v1/checkout failed", xhr, statusText, error);
            try {
                if (xhr.responseJSON.error) {
                    try {
                        handleInvalidAddress0(session, xhr.responseJSON.error);
                    } catch (e) {}
                    return;
                }
            } catch (e) {}
            handleInvalidAddress0(session);
        });
    }

    const RunningModes = {
        Static: "Static",
        Dynamic: "Dynamic"
    };

    const SerializeMethods = {
        [RunningModes.Static]() {
            // Formerly `collectCartItemWeb()`
            var items = [];
            $("#cart-saleitem")
                .find("li.item_")
                .each(function(i, item) {
                    //var seller_id = $(item).data('sid');
                    //var tid = $(item).data('tid');
                    var siid = parseInt($(item).data("siid"), 10);
                    var sio = parseInt($(item).data("sio"), 10);
                    var country = $(item).data("country");

                    var title = $(item)
                        .find(".title")
                        .html();
                    var option = $(item)
                        .find("select.option_ option:selected")
                        .html();
                    var option_value = parseInt(
                        $(item)
                            .find("select.option_ option:selected")
                            .val(),
                        10
                    );
                    var available = !!$(item)
                        .find(".notification-cart")
                        .hasClass("hidden");

                    var price = parseFloat(
                        $(item)
                            .find(".qty select[price], .qty input[price]").eq(0)
                            .attr("price")
                    );
                    var qty = parseInt(
                        $(item)
                            .find(".qty option:selected")
                            .val(),
                        10
                    );

                    if (!price && $(item).find(".price")) {
                        price = parseFloat(
                            $(item)
                                .find(".price")
                                .attr("price")
                        );
                    }
                    if (!qty && $(item).find('.qty input[type="text"]')) {
                        qty = parseInt(
                            $(item)
                                .find('.qty input[type="text"]')
                                .val(),
                            10
                        );
                    }
                    if (!option && $(item).find("span.option")) {
                        option_value = parseInt(
                            $(item)
                                .find("span.option")
                                .attr("option-id"),
                            10
                        );
                        option = $(item)
                            .find("span.option")
                            .html();
                    }

                    if (!available) {
                        throw (title || "An item") + " is not available";
                    }
                    if (!siid || !qty || (price != 0 && !price) || (sio && option_value != sio)) {
                        throw "Invalid cart data";
                    }

                    var item_data = {
                        title: title,
                        "sale-item-id": siid,
                        country: country,
                        price: price,
                        qty: qty
                    };

                    if (!!sio) {
                        item_data["sale-item-option-id"] = sio;
                        item_data["sale-item-option"] = option;
                    }

                    items.push(item_data);
                });
            console.log("items", items);
            return items;
        },
        [RunningModes.Dynamic](requestArgs) {
            const { sale_item_id, option_id, quantity, price, title, option, country /*testmode*/ } = requestArgs;
            return [
                {
                    title: title + (option ? " " + option : ""),
                    "sale-item-id": sale_item_id,
                    "sale-item-option-id": option_id,
                    country: country,
                    price: price,
                    qty: quantity
                }
            ];
        },
        getSerializationMethod(mode) {
            return this[mode];
        }
    };

    function didClickOn($targ, selector) {
        return $targ.parents(selector).length > 0 || $targ.is(selector);
    }

    const FancyApplePay = {
        stripeVersion: 'v2',
        clicked: false,
        label: "Fancy",
        afterAbort() {
            this.clicked = false;
        },
        init(label) {
            if (label) this.label = label;
            this.checkAvailability((available, testmode) => {
                if (available) {
                    $(document.body)
                        .find(StaticSelector)
                        .show();
                    this.attach(testmode, this);
                }
            });
        },
        checkAvailability(callback /* (available:bool, testmode:bool) -> void */) {
            if (location.args.force_button) {
                callback(true, true);
            }
            if (window.Stripe && window.Stripe.applePay) {
                window.Stripe.applePay.checkAvailability((available) => {
                    callback(available, false);
                });
            }
        },
        requestPurchase(mode, requestArgs) {
            var {
                testmode,
                sale_item_id,
                seller_id,
                option_id,
                quantity,
                country /*price, title, option, giftcard*/
            } = requestArgs;

            var is_express_checkout = false;
            if (sale_item_id != null) {
                mode = RunningModes.Dynamic;
                is_express_checkout = true;
            }
            const items = SerializeMethods.getSerializationMethod(mode)(requestArgs);
            country = null;
            const sum = items
                .reduce((prevSum, nextItem) => {
                    if (nextItem.country === "US") {
                        country = "US";
                    }
                    return prevSum + nextItem.price * nextItem.qty;
                }, 0)
                .toFixed(2);

            country = country || items[0].country;

            const paymentRequest = {
                currencyCode: "USD",
                countryCode: "US",
                total: {
                    label: FancyApplePay.label || "Fancy",
                    amount: sum
                },
                lineItems: buildLineItems({ subtotal_prices: sum, total_prices: sum }),
                requiredShippingContactFields: [window.__FancyUser.anonymous ? "email" : undefined, "postalAddress", "phone"].filter(Boolean),
                requiredBillingContactFields: ["postalAddress"]
            };
            console.log("Create ApplePaySession with", paymentRequest);

            var session;
            var handleSessionComplete = function(result, completionCallback) {
                try {
                    console.log("ApplePay result", result);
                    if (!session.checkout) {
                        console.log("checkout is not ready yet");
                        completionCallback(ApplePaySession.STATUS_FAILURE);
                        alert(BASIC_FAILURE_MESSAGE);
                        FancyApplePay.afterAbort();
                        return;
                    }

                    payment(session, result, completionCallback);
                } catch (e) {
                    completionCallback(ApplePaySession.STATUS_FAILURE);
                    alert(BASIC_FAILURE_MESSAGE);
                    FancyApplePay.afterAbort();
                    console.trace(e);
                }
            };

            if (testmode) {
                session = {
                    abort() {},
                    begin() {
                        session.onshippingcontactselected({
                            shippingContact: testShippingContact0
                        });
                    },
                    completeShippingContactSelection(status) {
                        if (status != ApplePaySession.STATUS_SUCCESS) {
                            console.log("Invalid shipping address");
                            return;
                        }
                        session.onshippingmethodselected({
                            shippingMethod: {
                                identifier: "0:0"
                            }
                        });
                    },
                    completeShippingMethodSelection(status) {
                        if (status != ApplePaySession.STATUS_SUCCESS) {
                            console.log("Invalid shipping address");
                            return;
                        }
                        handleSessionComplete(
                            {
                                token: {
                                    id: "TEST_APPLE_PAY",
                                    card: {
                                        name: "Jenny Rosen",
                                        address_line1: "12 Main Street",
                                        address_line2: "Apt 42",
                                        address_city: testShippingContact.locality,
                                        address_state: testShippingContact.administrativeArea,
                                        address_zip: testShippingContact.postalCode,
                                        address_country: testShippingContact.country,
                                        country: "US",
                                        exp_month: 2,
                                        exp_year: 2017,
                                        last4: "4242",
                                        object: "card",
                                        brand: "Visa",
                                        funding: "credit"
                                    }
                                },
                                shippingContact: testShippingContact
                            },
                            _ => _
                        );
                    }
                };
            } else {
                session = window.Stripe.applePay.buildSession(paymentRequest, handleSessionComplete);
            }
            session.is_express_checkout = is_express_checkout;
            session.oncancel = event => {
                this.afterAbort();
                console.log("ApplePaySession Cancelled", event);
            };

            session.onshippingcontactselected = function onshippingcontactselected({ shippingContact } /* = event */) {
                console.log("onshippingcontactselected", event);
                if (!session.is_express_checkout) {
                    post_checkout(session, _.extend({ sale_item_cart_id: null, shippingContact }, requestArgs));
                } else {
                    var cart_params = {
                        seller_id: seller_id,
                        quantity: quantity,
                        sale_item_id: sale_item_id,
                        express: true
                    };
                    if (option_id) {
                        cart_params.option_id = option_id;
                    }
                    post_checkout(session, _.extend({ express: cart_params, shippingContact }, requestArgs));
                }
            };

            session.onshippingmethodselected = function onshippingmethodselected(event) {
                console.log("onshippingmethodselected", event.shippingMethod);
                var kv = event.shippingMethod.identifier.split(":");
                if (kv.length !== 2) {
                    console.trace("Invalid shipping method information");
                    handleInvalidAddress1(session);
                    return;
                }
                const params = { shipping_option: {} };
                try {
                    if (session.is_express_checkout) {
                        params["express"] = true;
                    }
                    params.shipping_option[kv[0]] = parseInt(kv[1], 10);

                    $.ajax({
                        type: "PUT",
                        url: "/rest-api/v1/checkout",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(params)
                    })
                        .done(json => {
                            console.log("Checkout object", json);
                            if (json.error) {
                                console.trace("Error", json.error);
                                handleInvalidAddress1(session);
                                return;
                            }
                            session.checkout = json;
                            try {
                                for (seller_id in json.sale_items_freeze) {
                                    var seller_items = json.sale_items_freeze[seller_id];
                                    if (seller_items.checkout_available != true) {
                                        var error_message = null;
                                        for (var k in seller_items.items) {
                                            var seller_item = seller_items.items[k];
                                            if (seller_item.error_message) {
                                                error_message = seller_item.error_message;
                                                break;
                                            }
                                        }
                                        handleInvalidAddress1(session, error_message);
                                        return;
                                    }
                                }
                                var newTotal = {
                                    label: FancyApplePay.label || "Fancy",
                                    amount: parseFloat(json.total_prices).toFixed(2)
                                };
                                var newLineItems = buildLineItems(json);
                                session.completeShippingMethodSelection(
                                    ApplePaySession.STATUS_SUCCESS,
                                    newTotal,
                                    newLineItems
                                );
                            } catch (err) {
                                console.trace("Error", err);
                                handleInvalidAddress1(session);
                            }
                        })
                        .fail(function(xhr, statusText, error) {
                            console.log("PUT /rest-api/v1/checkout failed", xhr, statusText, error);
                            handleInvalidAddress1(session);
                        });
                } catch (e) {
                    console.trace(e);
                    handleInvalidAddress1(session);
                }
            };

            console.log("Start ApplePay Session");
            try {
                session.begin();
            } catch (e) {
                console.trace(e);
            }
        },
        attach(testmode) {
            $(document.body).on("click.applePayButton", StaticSelector, function(e) {
                e.preventDefault();
                console.log("clicked apple-pay-button");
                var $button = $(this);
                if (didClickOn($button, "#overlay-thing")) {
                    return;
                }
                if (FancyApplePay.clicked) {
                    return;
                }
                FancyApplePay.clicked = true;

                var title = null;
                var country = null;
                var sale_item_id = null;
                var seller_id = null;
                var option_id = null;
                var option = null;
                var quantity = 1;
                var price = null;
                var giftcard = null;
                if ($button.hasClass("checkout-express")) {
                    var $scope = $button.closest("fieldset");
                    var $option = $scope.find('select[name="option_id"]');
                    var $quantity = $scope.find('select[name="quantity"]');

                    title = $button.data("title");
                    country = $button.data("country");
                    sale_item_id = $button.attr("sii");
                    seller_id = $button.attr("sisi");
                    price = $button.data("price");

                    if (window.retrieve_giftcard_info) {
                        giftcard = window.retrieve_giftcard_info();
                    }

                    if ($option && $option.length > 0) {
                        option_id = parseInt($option.val(), 10) || null;
                        option = $option
                            .find("option:selected")
                            .val()
                            .trim();
                        price = $option.find("option:selected").data("price") || price;
                    }

                    if ($quantity) {
                        quantity = parseInt($quantity.val(), 10) || 1;
                    }
                }

                try {
                    FancyApplePay.requestPurchase(RunningModes.Static, {
                        sale_item_id,
                        seller_id,
                        testmode,
                        option_id,
                        quantity,
                        price,
                        title,
                        option,
                        country,
                        giftcard
                    });
                } catch (err) {
                    alert(err ? (err.message ? err.message : err) : "Unknown error occurred");
                    FancyApplePay.clicked = false;
                }
            });
        }
    };

    window.stripeOnload = function stripeOnload() {
        $(function() {
            if (window.stripePublishableKey && !window.Stripe.key) {
                window.Stripe.setPublishableKey(window.stripePublishableKey);
            }
            FancyApplePay.init();
        });
    };

    window.FancyApplePay = FancyApplePay;
})();
