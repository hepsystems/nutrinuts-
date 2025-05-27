// products.js (This would ideally be a separate file or fetched from a backend)
// For this example, we'll keep it in script.js for simplicity.

const productsData = [
    {
        id: 'peanut-butter',
        name: 'Peanut Butter',
        description: 'Creamy and delicious peanut butter made from the finest groundnuts.',
        image: 'https://iili.io/3DGsLyF.png',
        price: 8000,
        quizMatch: { preference: 'creamy', use: 'spread', health: 'protein' }
    },
    {
        id: 'roasted-groundnuts',
        name: 'Roasted Groundnuts',
        description: 'Perfectly roasted groundnuts for a healthy snack.',
        image: 'https://iili.io/3DVbYYv.jpg',
        price: 4000,
        quizMatch: { preference: 'crunchy', use: 'snack', health: 'protein' }
    },
    {
        id: 'groundnut-flour',
        name: 'Groundnut Flour',
        description: 'Finely ground groundnut flour, ideal for baking.',
        image: 'https://iili.io/3DWhFVe.png',
        price: 4500,
        quizMatch: { preference: 'versatile', use: 'baking', health: 'protein' }
    },
    {
        id: 'groundnut-oil',
        name: 'Groundnut Oil',
        description: 'Pure and natural groundnut oil for cooking.',
        image: 'https://iili.io/3DGsvTu.png',
        price: 7000,
        quizMatch: { preference: 'natural', use: 'cooking', health: 'heart' }
    },
    {
        id: 'groundnut-snacks',
        name: 'Groundnut Snacks',
        description: 'Delicious and healthy groundnut-based snacks.',
        image: 'https://iili.io/3DONyv9.png',
        price: 2500,
        quizMatch: { preference: 'sweet', use: 'snack', health: 'energy' }
    },
    {
        id: 'pumpkin-cooking-oil',
        name: 'Pumpkin Cooking oil',
        description: 'Exciting flavors in every bite of our groundnuts.', // Description seems to be a placeholder
        image: 'https://iili.io/3DGiszG.png',
        price: 7500,
        quizMatch: { preference: 'natural', use: 'cooking', health: 'vitamins' }
    },
    {
        id: 'groundnut-skincare',
        name: 'Groundnut Skincare',
        description: 'Nourishing skincare products with groundnut oil.',
        image: 'https://iili.io/3DGsWB4.png',
        price: 10000,
        quizMatch: { preference: 'natural', use: 'skincare', health: 'skin' }
    },
    {
        id: 'pumpkin-pieces',
        name: 'Pumpkin pieces (Chunks)',
        description: 'High-protein derivated meal',
        image: 'https://iili.io/3DGiD12.png',
        price: 18000,
        quizMatch: { preference: 'protein', use: 'meal', health: 'muscle' }
    },
    {
        id: 'organic-fertilizers',
        name: 'Organic Fertilizers',
        description: 'Eco-friendly fertilizers made from groundnuts.',
        image: 'https://iili.io/3DGiLXf.png',
        price: 18000,
        quizMatch: { preference: 'eco-friendly', use: 'garden', health: 'soil' }
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const mainContentSections = document.querySelectorAll('section:not(#manual-checkout-section)');
    const cartElement = document.getElementById('cart');


    // --- Cart Functionality ---
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const checkoutButton = document.getElementById('checkout-button');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color:white;">Your cart is empty.</p>';
            checkoutButton.style.display = 'none'; // Hide checkout button if cart is empty
        } else {
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <p>${item.name} (x${item.quantity}) - MK${(item.price * item.quantity).toLocaleString()}</p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
                totalPrice += item.price * item.quantity;
            });
            checkoutButton.style.display = 'block'; // Show checkout button if cart has items
        }
        cartTotalPriceElement.textContent = `Total: MK${totalPrice.toLocaleString()}`;
        saveCart();
    }

    function addToCart(productId) {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            renderCart();
            // Optional: Briefly highlight the cart to show something changed
            cartElement.classList.add('highlight-cart');
            setTimeout(() => {
                cartElement.classList.remove('highlight-cart');
            }, 500); // Remove highlight after 0.5 seconds
        } else {
             console.error(`Product with ID ${productId} not found in productsData.`);
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    // Event delegation for Add to Cart and Buy Now buttons on product grid
    document.querySelectorAll('.product-grid').forEach(grid => {
        grid.addEventListener('click', (event) => {
            const button = event.target;
            if (button.classList.contains('add-to-cart') || button.classList.contains('buy-now')) {
                const productId = button.dataset.productId; // Get product ID directly from data attribute
                if (productId) {
                    if (button.classList.contains('buy-now')) {
                        // For 'Buy Now', we'll just add to cart and alert.
                        // In a real app, this would redirect to a checkout page with this item.
                        const product = productsData.find(p => p.id === productId);
                        if (product) {
                            alert(`Proceeding to buy ${product.name} now for MK${product.price.toLocaleString()}!`);
                        }
                    }
                    addToCart(productId); // Add to cart for both button types
                } else {
                    console.error("Product ID not found on button:", button);
                }
            }
        });
    });

    // Event listener for dynamically added cart remove buttons
    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const productId = event.target.dataset.id;
            removeFromCart(productId);
        }
    });

    renderCart(); // Initial render of the cart

    // --- Search Functionality ---
    const searchBar = document.getElementById('search-bar');
    const searchForm = searchBar.closest('form');
    let suggestionsDiv = document.createElement('div');
    suggestionsDiv.classList.add('suggestions');
    searchForm.appendChild(suggestionsDiv); // Append suggestions div after the search bar

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        suggestionsDiv.innerHTML = ''; // Clear previous suggestions

        if (query.length > 1) {
            const filteredProducts = productsData.filter(product =>
                product.name.toLowerCase().includes(query)
            ).slice(0, 5); // Limit to 5 suggestions

            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.textContent = product.name;
                    suggestionItem.addEventListener('click', () => {
                        searchBar.value = product.name;
                        suggestionsDiv.innerHTML = ''; // Clear suggestions
                        // Optionally, trigger a search or navigate to product page
                        // For a simple search, you might filter the displayed products here
                        alert(`Searching for: ${product.name}`);
                    });
                    suggestionsDiv.appendChild(suggestionItem);
                });
            } else {
                suggestionsDiv.innerHTML = '<div>No results found</div>';
            }
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (event) => {
        if (!searchForm.contains(event.target)) {
            suggestionsDiv.innerHTML = '';
        }
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            alert(`Performing search for: ${searchTerm}`);
            // Here you'd typically navigate to a search results page or filter products on current page
        }
    });


    // --- Quiz Functionality and Product Recommendations ---
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizSection = document.getElementById('quiz-section');
    const quizContainer = document.getElementById('quiz-container');
    const questionText = document.getElementById('question-text');
    const answerOptionsDiv = document.getElementById('answer-options'); // Corrected ID usage
    const quizResult = document.getElementById('quiz-result');
    const rewardSection = document.getElementById('reward-section');
    const recommendationsContainer = document.getElementById('recommendations-container');
    const recommendedProductsDisplay = recommendationsContainer.querySelector('.product'); // The single product div inside recommendations-container

    let currentQuestionIndex = 0;
    let userQuizAnswers = {}; // Store answers, e.g., { 'preference': 'creamy', 'use': 'baking' }

    const quizQuestions = [
        {
            id: 'preference',
            question: 'What texture or experience do you prefer?',
            answers: [
                { text: 'Creamy and smooth', value: 'creamy' },
                { text: 'Crunchy and satisfying', value: 'crunchy' },
                { text: 'Versatile for many uses', value: 'versatile' },
                { text: 'Natural and pure', value: 'natural' },
                { text: 'Sweet and delightful', value: 'sweet' },
                { text: 'Protein-rich and building', value: 'protein' },
                { text: 'Eco-friendly and sustainable', value: 'eco-friendly' }
            ]
        },
        {
            id: 'use',
            question: 'What is your primary use for groundnut products?',
            answers: [
                { text: 'Spreading on toast/sandwiches', value: 'spread' },
                { text: 'Snacking directly', value: 'snack' },
                { text: 'Baking and cooking', value: 'baking' },
                { text: 'General cooking/frying', value: 'cooking' },
                { text: 'Meal supplement/protein boost', value: 'meal' },
                { text: 'Skincare routine', value: 'skincare' },
                { text: 'Gardening/soil enrichment', value: 'garden' }
            ]
        },
        {
            id: 'health',
            question: 'What health benefit are you most interested in?',
            answers: [
                { text: 'Protein and muscle support', value: 'protein' },
                { text: 'Heart health and good fats', value: 'heart' },
                { text: 'Energy and vitality', value: 'energy' },
                { text: 'Vitamins and overall wellness', value: 'vitamins' },
                { text: 'Skin nourishment', value: 'skin' },
                { text: 'Soil health and plant growth', value: 'soil' }
            ]
        }
        // Add more questions as needed
    ];

    startQuizBtn.addEventListener('click', () => {
        startQuizBtn.style.display = 'none'; // Hide start button
        quizContainer.style.display = 'block'; // Show quiz questions
        loadQuizQuestion();
    });

    function loadQuizQuestion() {
        if (currentQuestionIndex < quizQuestions.length) {
            const q = quizQuestions[currentQuestionIndex];
            questionText.textContent = q.question;
            answerOptionsDiv.innerHTML = ''; // Clear previous answers

            q.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.classList.add('answer-btn');
                button.textContent = answer.text;
                button.value = answer.value; // Store the value
                button.dataset.questionId = q.id; // Link button to question ID
                button.addEventListener('click', handleQuizAnswer);
                answerOptionsDiv.appendChild(button);
            });
            quizResult.textContent = ''; // Clear previous quiz result
        } else {
            showQuizResults(); // Quiz completed
        }
    }

    function handleQuizAnswer(event) {
        const questionId = event.target.dataset.questionId;
        const answerValue = event.target.value;
        userQuizAnswers[questionId] = answerValue; // Store the user's answer for this question

        currentQuestionIndex++;
        loadQuizQuestion(); // Load next question or show results
    }

    function showQuizResults() {
        quizContainer.style.display = 'none';
        quizResult.textContent = 'Quiz completed! Finding your perfect match...';
        quizResult.style.display = 'block';

        // Get and display recommendation
        const recommendedProduct = getRecommendationFromQuiz(userQuizAnswers);
        displayRecommendedProduct(recommendedProduct);

        // Show reward section
        rewardSection.style.display = 'block';
        rewardSection.querySelector('#reward-message').textContent = 'Congratulations! Enjoy this personalized recommendation just for you.';
    }

    function getRecommendationFromQuiz(answers) {
        let bestMatch = null;
        let highestScore = -1;

        productsData.forEach(product => {
            let score = 0;

            // Scoring based on quiz answers
            if (answers.preference && product.quizMatch.preference === answers.preference) {
                score += 3; // Higher weight for main preference
            }
            if (answers.use && product.quizMatch.use === answers.use) {
                score += 2;
            }
            if (answers.health && product.quizMatch.health === answers.health) {
                score += 1;
            }
            // Add more complex scoring or criteria here as needed

            if (score > highestScore) {
                highestScore = score;
                bestMatch = product;
            }
        });

        // Fallback: If no strong match, or quiz not completed, recommend a popular item or a random one
        if (!bestMatch && productsData.length > 0) {
            // As a fallback, you could return a popular product, or just the first one
            // For now, let's return the most popular (peanut butter) as a default.
            return productsData.find(p => p.id === 'peanut-butter') || productsData[0];
        }
        return bestMatch;
    }

    function displayRecommendedProduct(product) {
        // If no product found, hide recommendations section
        if (!product) {
            recommendationsContainer.style.display = 'none';
            return;
        }

        // Update the single product div inside recommendations-container
        recommendedProductsDisplay.querySelector('img').src = product.image;
        recommendedProductsDisplay.querySelector('img').alt = product.name;
        recommendedProductsDisplay.querySelector('h3').textContent = product.name;
        recommendedProductsDisplay.querySelector('p').textContent = product.description;
        // Dynamically set button text with price for recommended product
        recommendedProductsDisplay.querySelector('.buy-now').textContent = `Buy Now - MK${product.price.toLocaleString()}`;
        recommendedProductsDisplay.querySelector('.add-to-cart').textContent = 'Add to Cart';

        // Ensure data-product-id is set for buttons in the recommended product
        recommendedProductsDisplay.querySelector('.buy-now').dataset.productId = product.id;
        recommendedProductsDisplay.querySelector('.add-to-cart').dataset.productId = product.id;

        // Add event listeners for the dynamically updated recommended product's buttons
        recommendedProductsDisplay.querySelector('.add-to-cart').onclick = () => addToCart(product.id);
        recommendedProductsDisplay.querySelector('.buy-now').onclick = () => {
            alert(`Proceeding to buy ${product.name} now for MK${product.price.toLocaleString()}!`);
            addToCart(product.id); // Add to cart for demonstration
        };

        recommendationsContainer.style.display = 'block'; // Show the container now that it's populated
    }

    // --- Manual Checkout Logic ---
    const manualCheckoutSection = document.getElementById('manual-checkout-section');
    const checkoutForm = document.getElementById('checkout-form');
    const backToCartButton = document.getElementById('back-to-cart-button');
    const orderConfirmationDiv = document.getElementById('order-confirmation');
    const confirmationTotalPrice = document.getElementById('confirmation-total-price');
    const emailOrderButton = document.getElementById('email-order-button');
    const whatsappOrderButton = document.getElementById('whatsapp-order-button'); // NEW LINE
    const continueShoppingButton = document.getElementById('continue-shopping-button');

    // Show checkout form when checkout button is clicked
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }
        // Hide all other main sections and show manual checkout
        mainContentSections.forEach(section => section.style.display = 'none');
        cartElement.style.display = 'none'; // Hide cart sidebar
        manualCheckoutSection.style.display = 'block';
        orderConfirmationDiv.style.display = 'none'; // Ensure confirmation is hidden
        checkoutForm.style.display = 'flex'; // Show the form
    });

    // Back to cart button
    backToCartButton.addEventListener('click', () => {
        manualCheckoutSection.style.display = 'none'; // Hide checkout
        mainContentSections.forEach(section => section.style.display = 'block'); // Show main sections
        cartElement.style.display = 'block'; // Show cart sidebar
        // You might want to scroll to the top or a specific section here
    });

    // Handle checkout form submission
    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        // Basic form validation
        const customerName = document.getElementById('customer-name').value.trim();
        const customerEmail = document.getElementById('customer-email').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const customerAddress = document.getElementById('customer-address').value.trim();
        const customerNotes = document.getElementById('customer-notes').value.trim();

        if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
            alert('Please fill in all required customer information fields.');
            return;
        }

        const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderDetails = cart.map(item => `${item.name} (x${item.quantity}) - MK${(item.price * item.quantity).toLocaleString()}`).join('\n');

        const emailSubject = encodeURIComponent(`New Order from Hep NutriNuts Blend - Total: MK${orderTotal.toLocaleString()}`);
        const emailBody = encodeURIComponent(
            `Customer Name: ${customerName}\n` +
            `Customer Email: ${customerEmail}\n` +
            `Customer Phone: ${customerPhone}\n` +
            `Delivery Address: ${customerAddress}\n` +
            (customerNotes ? `Order Notes: ${customerNotes}\n\n` : '\n') +
            `Order Details:\n${orderDetails}\n\n` +
            `Total Amount: MK${orderTotal.toLocaleString()}\n\n` +
            `Please confirm payment to +265 999 123 456 (Airtel Money / Mpamba) and arrange delivery.`
        );

        // NEW: WhatsApp Body for easier formatting within WhatsApp
        const whatsappBody = encodeURIComponent(
            `*New Order from Hep NutriNuts Blend*\n\n` +
            `*Total:* MK${orderTotal.toLocaleString()}\n\n` +
            `*Customer Name:* ${customerName}\n` +
            `*Email:* ${customerEmail}\n` +
            `*Phone:* ${customerPhone}\n` +
            `*Delivery Address:* ${customerAddress}\n` +
            (customerNotes ? `*Order Notes:* ${customerNotes}\n\n` : '\n') +
            `*Order Details:*\n${orderDetails}\n\n` +
            `_I have placed an order and will proceed with mobile money payment to +265 999 123 456. Please confirm receipt and arrange delivery._`
        );


        // Update confirmation message
        confirmationTotalPrice.textContent = `MK${orderTotal.toLocaleString()}`;
        emailOrderButton.href = `mailto:hephiri3@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        // NEW: Set WhatsApp button href
        whatsappOrderButton.href = `https://wa.me/265888004365?text=${whatsappBody}`; // Use your WhatsApp number +265888004365


        // Hide form, show confirmation
        checkoutForm.style.display = 'none';
        orderConfirmationDiv.style.display = 'block';

        // Clear the cart after order is "placed"
        cart = [];
        saveCart();
        renderCart(); // Update cart display to show it's empty
    });

    // Continue shopping button on confirmation
    continueShoppingButton.addEventListener('click', () => {
        manualCheckoutSection.style.display = 'none'; // Hide checkout
        mainContentSections.forEach(section => section.style.display = 'block'); // Show main sections
        cartElement.style.display = 'block'; // Show cart sidebar
        // You might want to scroll to the top or a specific section here
    });


    // --- TensorFlow.js (Dummy Implementation) ---
    // This is a placeholder as the actual ML model integration is complex
    // and would require a trained model (e.g., for predicting product popularity).
    // For now, it just shows the library is loaded.

    if (typeof tf !== 'undefined') {
        console.log('TensorFlow.js is loaded!');
        // Example: a simple dummy model for "recommendations" based on a static input
        function dummyRecommendationModel() {
            // In a real scenario, you'd load a trained model:
            // const model = await tf.loadLayersModel('path/to/your/model.json');
            // Then you'd preprocess user data and make a prediction:
            // const input = tf.tensor2d([[0.1, 0.5, 0.2]]); // Example user preference data
            // const prediction = model.predict(input);
            // console.log('Dummy ML prediction:', prediction.dataSync());

            console.log('Dummy recommendation model running. (Requires a trained model for real use)');
            // For now, let's trigger the quiz-based recommendation after a small delay
            // to simulate ML processing
            // setTimeout(() => {
            //     if (currentQuestionIndex === quizQuestions.length) { // Only run if quiz is done
            //         const recommended = getRecommendationFromQuiz(userQuizAnswers);
            //         displayRecommendedProduct(recommended);
            //     }
            // }, 1000);
        }
        // You can call this function when the page loads, or based on user activity
        // dummyRecommendationModel();
    } else {
        console.warn('TensorFlow.js is not loaded.');
    }

    // Initial check for TensorFlow.js if needed immediately on load
    // If you plan to use TFJS for initial recommendations without the quiz,
    // you would call dummyRecommendationModel() here.
});