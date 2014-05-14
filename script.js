;(function($) {
    'use strict';

    // reference the 'load more donuts' button
    var $load_more_donuts = $('#load-more-donuts');

    // reference where to put more donuts
    var $more_donuts = $('#more-donuts');

    // NEW: reference/pre-compile donut template
    var donut_template = _.template($('#donut-template').html());

    // reference product display area
    var $products_container = $('#all-products');

    // reference review list
    var $review_list = $('#sidebar-review-list');

    // reference form elements
    var $form_review = $('#review-form');
    var $input_name = $('#name');
    var $input_email = $('#email');
    var $input_review = $('#review');

    // NEW: reference/pre-compile comment template
    var comment_template = _.template($('#comment-template').html());

    // reference cart item count element
    var $cart_item_count = $('#cart-item-count');

    // reference to cart items list
    var $cart_items = $('#cart-items');

    // Function to display more donuts. Called after AJAX request
    // completes.
    var display_donuts = function(data) {
        // set up variables we need in the for loop below
        //var $li, $a, $figure, $img, $figcaption;
        var tokens, donut;

        for (var i = 0; i < data.donuts.length; i++) {
            // NEW: Build object containing token values for template, making
            // sure key names match template token names.
            tokens = {
                id: data.donuts[i].id,
                name: data.donuts[i].name,
                image: data.donuts[i].image
            };

            // NEW: Generate markup from template.
            donut = donut_template(tokens);

            // NEW: Append generated markup to DOM.
            $more_donuts.append(donut);
        }

        // slide down the more donuts list
        $more_donuts.slideDown();

        // get rid of the load more donuts button, then remove it
        $load_more_donuts.fadeOut('normal', function() {
            $load_more_donuts.remove();
        });
    };

    // event listener for 'load more donuts' button
    $load_more_donuts.on('click', function() {
        // add hidden class for dramatic slide down later
        $more_donuts.addClass('hidden');

        // make ajax request to our local API
        $.ajax({
            url: 'api.php?action=more_donuts',
            type: 'get',
            dataType: 'json',
            success: function(data, status, xhr) {
                // when AJAX succeeds, call our 'display_donuts' function, passing
                // in the data returned from the API
                display_donuts(data);
            }
        });
    });

    $products_container.on('click', '.product', function(e) {
        e.preventDefault();

        // variable to hold $(this) (for performance reasons)
        var $this = $(this);

        // toggle the selected class
        $this.toggleClass('product-selected');

        // update the number of items in cart
        $cart_item_count.text($('.product-selected').length);

        // if this product is selected, make sure it's shown in the cart
        if ($this.hasClass('product-selected')) {
            // do we have a <li> in the cart with an id containing the clicked donut's data-donut value?
            // if not, create a new <li> and add it to the cart items.
            if ($('#cart-item-' + $this.data('donut-id')).length === 0) {
                // create new <li>
                var $li = $('<li>');

                // set the id so we can check for/remove it later
                $li.attr('id', 'cart-item-' + $this.data('donut-id'));

                // add a hidden class to the <li> for sliding down later
                $li.addClass('hidden');

                // set the text equal to the caption of the clicked product
                $li.text($this.data('donut-name'));

                // append the <li> to the cart items
                $cart_items.append($li);

                // slide the <li> into view
                $li.slideDown();
            }
        // otherwise, make sure it's *not* shown in the cart
        } else {
            // slide up the <li> with the proper id, and then remove it
            $('#cart-item-' + $this.data('donut-id')).slideUp('fast', function() {
                $(this).remove();
            });
        }
    });

    $form_review.on('submit', function(e) {
        e.preventDefault();

        // make sure all fields are filled in
        if ($input_review.val() !== '' && $input_email.val() !== '' && $input_name.val() !== '') {
            // NEW: Store tokens for template replacement in object, making sure
            // key names match template token names.
            var tokens = {
                review: $input_review.val(),
                email: $input_email.val(),
                name: $input_name.val()
            };

            // NEW: Generate markup from the template.
            var review = comment_template(tokens);

            // NEW: Prepend generated markup to the DOM.
            $review_list.prepend(review);

            // slide down the new review (fancy!)
            $review_list.find('.review:first').slideDown();

            // reset/clear out the form fields
            $input_name.val('');
            $input_email.val('');
            $input_review.val('');
        }
    });
})(window.jQuery);
