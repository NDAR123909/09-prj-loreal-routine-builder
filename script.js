/* Initialize the application */
document.addEventListener('DOMContentLoaded', () => {
  loadSelectedProducts();
  updateGenerateButtonState();
  
  // Initialize language toggle
  initializeLanguageToggle();
  
  // Clear placeholder in chat window if user starts typing
  userInput.addEventListener('focus', () => {
    if (chatWindow.innerHTML.includes('placeholder-message')) {
      chatWindow.innerHTML = '';
    }
  });
});

/* ===============================
   RTL LANGUAGE SUPPORT SYSTEM
   =============================== */

let isRTL = false;

/* Initialize language toggle functionality */
function initializeLanguageToggle() {
  const languageToggle = document.getElementById('languageToggle');
  const langText = document.getElementById('langText');
  
  languageToggle.addEventListener('click', () => {
    isRTL = !isRTL;
    toggleLanguage();
  });
}

/* Toggle between English and Arabic (RTL) */
function toggleLanguage() {
  const html = document.documentElement;
  const langText = document.getElementById('langText');
  
  if (isRTL) {
    // Switch to Arabic (RTL)
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
    langText.textContent = 'English';
    updateAllTextToArabic();
    updateChatPlaceholder();
  } else {
    // Switch to English (LTR)
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    langText.textContent = 'عربي';
    updateAllTextToEnglish();
    updateChatPlaceholder();
  }
  
  // Save language preference
  localStorage.setItem('language', isRTL ? 'ar' : 'en');
  
  // Update chat with language change message
  const message = isRTL ? 
    "تم تغيير اللغة إلى العربية. يمكنني مساعدتك في العناية بالجمال والبشرة!" :
    "Language changed to English. I can help you with beauty and skincare advice!";
  
  setTimeout(() => {
    addChatMessage(message, 'bot');
  }, 300);
}

/* Update all text elements to Arabic */
function updateAllTextToArabic() {
  document.querySelectorAll('[data-ar]').forEach(element => {
    if (element.tagName === 'INPUT') {
      element.placeholder = element.dataset.ar;
    } else if (element.tagName === 'OPTION') {
      element.textContent = element.dataset.ar;
    } else {
      element.textContent = element.dataset.ar;
    }
  });
}

/* Update all text elements to English */
function updateAllTextToEnglish() {
  document.querySelectorAll('[data-en]').forEach(element => {
    if (element.tagName === 'INPUT') {
      element.placeholder = element.dataset.en;
    } else if (element.tagName === 'OPTION') {
      element.textContent = element.dataset.en;
    } else {
      element.textContent = element.dataset.en;
    }
  });
}

/* Update chat input placeholder based on language */
function updateChatPlaceholder() {
  const userInput = document.getElementById('userInput');
  if (isRTL) {
    userInput.placeholder = userInput.dataset.placeholderAr;
  } else {
    userInput.placeholder = userInput.dataset.placeholderEn;
  }
}

/* Update selected products display with RTL support */
function updateSelectedProductsDisplay() {
  if (selectedProducts.length === 0) {
    const noProductsText = isRTL ? 'لم يتم اختيار منتجات بعد' : 'No products selected yet';
    selectedProductsList.innerHTML = `<p style="color: #999; font-style: italic;">${noProductsText}</p>`;
    return;
  }

  const clearAllText = isRTL ? 'مسح الكل' : 'Clear All';
  const clearAllBtn = selectedProducts.length > 1 ? 
    `<button class="clear-all-btn" onclick="clearAllProducts()">${clearAllText}</button>` : '';

  selectedProductsList.innerHTML = clearAllBtn + selectedProducts
    .map(product => `
      <div class="selected-item">
        <span>${product.name} - ${product.brand}</span>
        <button class="remove-item" onclick="removeProduct(${product.id})">&times;</button>
      </div>
    `)
    .join("");
}

/* Enhanced response generation with RTL support */
function generateResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Arabic language responses
  if (isRTL) {
    return generateArabicResponse(message);
  }
  
  // Check if asking about current routine
  if (currentRoutine && (message.includes('routine') || message.includes('step') || message.includes('order'))) {
    return generateRoutineFollowUp(message);
  }
  
  // Check for selected products questions
  if (message.includes('selected') || message.includes('products i chose')) {
    if (selectedProducts.length === 0) {
      return "You haven't selected any products yet! Browse through the categories above and click on products you'd like to include in your routine.";
    }
    return `You've selected ${selectedProducts.length} products: ${selectedProducts.map(p => `${p.name} by ${p.brand}`).join(', ')}. Click "Generate Routine" to get personalized recommendations!`;
  }
  
  // Find matching response
  for (const [key, response] of Object.entries(chatResponses)) {
    if (message.includes(key)) {
      return response;
    }
  }
  
  // Context-aware responses based on selected products
  if (selectedProducts.length > 0) {
    const categories = [...new Set(selectedProducts.map(p => p.category))];
    
    if (message.includes('how') && message.includes('use')) {
      return `Based on your selected ${categories.join(' and ')} products, I'd recommend generating your complete routine first. Click the "Generate Routine" button and I'll give you step-by-step instructions!`;
    }
    
    if (message.includes('when')) {
      return `Great question! The timing depends on your products. Generally, cleansers and treatments work well morning and night, while sunscreen is for daytime only. Generate your routine for specific timing!`;
    }
  }
  
  // Smart fallback responses
  const helpfulResponses = [
    "I'd love to help! Try asking about specific products, skin concerns, or routine steps. You can also select products above and generate a personalized routine.",
    "I'm here to help with your beauty routine! Ask me about skincare ingredients, product recommendations, or how to use your selected products.",
    "Let me assist you! I can answer questions about the L'Oréal brands, skincare routines, makeup application, or hair care. What would you like to know?",
    "I'm your personal beauty advisor! Feel free to ask about product ingredients, skin types, routine order, or any beauty concerns you have."
  ];
  
  return helpfulResponses[Math.floor(Math.random() * helpfulResponses.length)];
}

/* Arabic responses for RTL mode */
function generateArabicResponse(message) {
  const arabicResponses = {
    "hello": "مرحباً! أنا هنا لمساعدتك في روتين الجمال. ماذا تريدين أن تعرفي؟",
    "hi": "أهلاً! هل أنت مستعدة لإنشاء روتين الجمال المثالي؟ اسأليني أي شيء!",
    "صباح": "روتين الصباح المثالي: منظف ← سيروم فيتامين سي ← مرطب ← واقي الشمس. ابقيه بسيطاً ولكن منتظماً!",
    "مساء": "روتين المساء: منظف ← علاج (ريتينول/أحماض) ← مرطب ← كريم العينين عند الحاجة. هذا وقت إصلاح البشرة.",
    "بشرة حساسة": "البشرة الحساسة تحتاج منتجات لطيفة خالية من العطور. ابحثي عن منتجات تحتوي على النياسيناميد والسيراميد.",
    "حب الشباب": "للبشرة المعرضة لحب الشباب، استخدمي حمض الساليسيليك أو البنزويل بيروكسايد. منتجات لاروش بوزيه ممتازة لعلاج البثور.",
    "مرطب": "المرطبات تحافظ على رطوبة البشرة وتحمي الحاجز الطبيعي. ابحثي عن مكونات مثل السيراميد وحمض الهيالورونيك.",
    "شكرا": "على الرحب والسعة! أنا هنا كلما احتجت نصائح الجمال. بشرتك ستشكرك لاعتنائك الجيد بها!"
  };

  // Check for Arabic keywords
  for (const [key, response] of Object.entries(arabicResponses)) {
    if (message.includes(key)) {
      return response;
    }
  }

  // Default Arabic responses
  const defaultArabicResponses = [
    "أحب أن أساعدك! جربي السؤال عن منتجات محددة، مشاكل البشرة، أو خطوات الروتين.",
    "أنا هنا لمساعدتك في روتين الجمال! اسأليني عن مكونات العناية بالبشرة أو توصيات المنتجات.",
    "دعيني أساعدك! يمكنني الإجابة عن أسئلة حول علامات لوريال التجارية، روتين العناية بالبشرة، أو تطبيق المكياج.",
    "أنا مستشارة الجمال الشخصية! لا تترددي في السؤال عن مكونات المنتجات، أنواع البشرة، أو أي اهتمامات جمالية لديك."
  ];

  return defaultArabicResponses[Math.floor(Math.random() * defaultArabicResponses.length)];
}

/* Enhanced routine generation with RTL support */
function generateRoutine(products) {
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];
  
  let routine = {
    title: isRTL ? "روتين الجمال الشخصي الخاص بك" : "Your Personalized Beauty Routine",
    intro: isRTL ? 
      `لقد أنشأت روتيناً شخصياً باستخدام ${products.length} منتجات مختارة بعناية${brands.length > 1 ? ` من ${brands.join('، ')}` : ` من ${brands[0]}`}.` :
      `I've created a personalized routine using ${products.length} carefully selected ${brands.length > 1 ? `products from ${brands.join(', ')}` : `${brands[0]} products`}.`,
    sections: []
  };

  // Generate sections based on language
  if (isRTL) {
    routine.sections = generateArabicRoutineSections(products);
    routine.tips = generateArabicTips(categories, brands);
  } else {
    // Use existing English routine generation
    const morningProducts = products.filter(p => 
      p.category === 'cleanser' || 
      p.category === 'moisturizer' || 
      p.category === 'skincare' && (p.name.includes('Vitamin C') || p.name.includes('SPF')) ||
      p.name.includes('SPF')
    );

    if (morningProducts.length > 0) {
      routine.sections.push({
        title: "Morning Routine",
        steps: generateMorningSteps(morningProducts)
      });
    }

    // Evening routine
    const eveningProducts = products.filter(p => 
      p.category === 'cleanser' || 
      p.category === 'moisturizer' || 
      p.category === 'skincare' && (p.name.includes('Retinol') || p.name.includes('PM'))
    );

    if (eveningProducts.length > 0) {
      routine.sections.push({
        title: "Evening Routine",
        steps: generateEveningSteps(eveningProducts)
      });
    }

    // Haircare routine
    const haircareProducts = products.filter(p => p.category === 'haircare' || p.category === 'hair styling' || p.category === 'hair color');
    if (haircareProducts.length > 0) {
      routine.sections.push({
        title: "Hair Care Routine",
        steps: generateHaircareSteps(haircareProducts)
      });
    }

    // Makeup routine
    const makeupProducts = products.filter(p => p.category === 'makeup');
    if (makeupProducts.length > 0) {
      routine.sections.push({
        title: "Makeup Application",
        steps: generateMakeupSteps(makeupProducts)
      });
    }

    // Special care
    const specialProducts = products.filter(p => 
      p.category === 'suncare' || 
      p.category === 'men\'s grooming' || 
      p.category === 'fragrance'
    );

    if (specialProducts.length > 0) {
      routine.sections.push({
        title: "Special Care & Finishing Touches",
        steps: generateSpecialSteps(specialProducts)
      });
    }

    routine.tips = generateTips(categories, brands);
  }

  return routine;
}

/* Generate Arabic routine sections */
function generateArabicRoutineSections(products) {
  let sections = [];
  
  // Morning routine in Arabic
  const morningProducts = products.filter(p => 
    p.category === 'cleanser' || 
    p.category === 'moisturizer' || 
    p.category === 'skincare' && (p.name.includes('Vitamin C') || p.name.includes('SPF')) ||
    p.name.includes('SPF')
  );

  if (morningProducts.length > 0) {
    sections.push({
      title: "روتين الصباح",
      steps: generateArabicMorningSteps(morningProducts)
    });
  }

  // Evening routine in Arabic
  const eveningProducts = products.filter(p => 
    p.category === 'cleanser' || 
    p.category === 'moisturizer' || 
    p.category === 'skincare' && (p.name.includes('Retinol') || p.name.includes('PM'))
  );

  if (eveningProducts.length > 0) {
    sections.push({
      title: "روتين المساء",
      steps: generateArabicEveningSteps(eveningProducts)
    });
  }

  // Haircare in Arabic
  const haircareProducts = products.filter(p => p.category === 'haircare' || p.category === 'hair styling' || p.category === 'hair color');
  if (haircareProducts.length > 0) {
    sections.push({
      title: "روتين العناية بالشعر",
      steps: generateArabicHaircareSteps(haircareProducts)
    });
  }

  // Makeup in Arabic
  const makeupProducts = products.filter(p => p.category === 'makeup');
  if (makeupProducts.length > 0) {
    sections.push({
      title: "تطبيق المكياج",
      steps: generateArabicMakeupSteps(makeupProducts)
    });
  }

  return sections;
}

/* Arabic morning steps */
function generateArabicMorningSteps(products) {
  let steps = [];
  
  const cleanser = products.find(p => p.category === 'cleanser');
  if (cleanser) {
    steps.push(`ابدئي بـ ${cleanser.name} لتنظيف البشرة بلطف وإزالة تراكمات الليل.`);
  }

  const vitaminC = products.find(p => p.name.includes('Vitamin C'));
  if (vitaminC) {
    steps.push(`طبقي ${vitaminC.name} لإشراق البشرة وحمايتها بمضادات الأكسدة.`);
  }

  const moisturizer = products.find(p => p.category === 'moisturizer' && !p.name.includes('PM'));
  if (moisturizer) {
    steps.push(`تابعي مع ${moisturizer.name} لترطيب البشرة وتحضيرها لليوم.`);
  }

  const spf = products.find(p => p.name.includes('SPF'));
  if (spf) {
    steps.push(`اختتمي مع ${spf.name} للحماية الأساسية من الأشعة فوق البنفسجية. لا تتخطي واقي الشمس أبداً!`);
  }

  if (steps.length === 0) {
    steps.push("طبقي منتجاتك المختارة بالترتيب: منظف، علاجات، مرطب، وواقي الشمس.");
  }

  return steps;
}

/* Arabic evening steps */
function generateArabicEveningSteps(products) {
  let steps = [];
  
  const cleanser = products.find(p => p.category === 'cleanser');
  if (cleanser) {
    steps.push(`ابدئي روتين المساء مع ${cleanser.name} لإزالة المكياج والأوساخ والتلوث من اليوم.`);
  }

  const retinol = products.find(p => p.name.includes('Retinol'));
  if (retinol) {
    steps.push(`طبقي ${retinol.name} لتعزيز تجديد الخلايا وتقليل علامات الشيخوخة. ابدئي ببطء إذا كنت جديدة على الريتينول.`);
  }

  const nightMoisturizer = products.find(p => p.category === 'moisturizer' && p.name.includes('PM')) || 
                          products.find(p => p.category === 'moisturizer');
  if (nightMoisturizer) {
    steps.push(`اختتمي علاجاتك مع ${nightMoisturizer.name} للترطيب والإصلاح طوال الليل.`);
  }

  if (steps.length === 0) {
    steps.push("اتبعي روتين مساء بسيط: نظفي جيداً، طبقي العلاجات، ورطبي.");
  }

  return steps;
}

/* Arabic haircare steps */
function generateArabicHaircareSteps(products) {
  let steps = [];
  
  const shampoo = products.find(p => p.name.includes('Shampoo'));
  if (shampoo) {
    steps.push(`اغسلي شعرك بـ ${shampoo.name}، مع التركيز على فروة الرأس والجذور.`);
  }

  const conditioner = products.find(p => p.name.includes('Conditioner'));
  if (conditioner) {
    steps.push(`طبقي ${conditioner.name} من المنتصف إلى الأطراف، اتركيه لمدة 2-3 دقائق، ثم اشطفيه جيداً.`);
  }

  if (steps.length === 0) {
    steps.push("اتبعي الروتين الأساسي: شامبو، بلسم، وصففي حسب الحاجة.");
  }

  return steps;
}

/* Arabic makeup steps */
function generateArabicMakeupSteps(products) {
  let steps = [];
  
  const foundation = products.find(p => p.name.includes('Foundation'));
  if (foundation) {
    steps.push(`أنشئي قاعدة متساوية مع ${foundation.name}، امزجي للخارج من وسط الوجه.`);
  }

  const mascara = products.find(p => p.name.includes('Mascara'));
  if (mascara) {
    steps.push(`عززي رموشك مع ${mascara.name}، طبقي من الجذر إلى الطرف بحركات متعرجة.`);
  }

  if (steps.length === 0) {
    steps.push("طبقي منتجات المكياج بالترتيب التقليدي: قاعدة، عيون، شفاه.");
  }

  return steps;
}

/* Arabic tips */
function generateArabicTips(categories, brands) {
  let tips = [
    "💡 اختبري المنتجات الجديدة دائماً على منطقة صغيرة قبل الاستخدام الكامل",
    "💡 الانتظام هو المفتاح - التزمي بروتينك للحصول على أفضل النتائج",
    "💡 طبقي المنتجات بأيدي أو أدوات نظيفة"
  ];

  if (categories.includes('skincare')) {
    tips.push("💡 للعناية بالبشرة، طبقي من الأرق إلى الأكثف قواماً");
  }

  if (categories.includes('haircare')) {
    tips.push("💡 استخدمي الماء الفاتر عند غسل الشعر لمنع التلف");
  }

  return tips;
}

/* Load language preference on startup */
function loadLanguagePreference() {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage === 'ar') {
    isRTL = true;
    toggleLanguage();
  }
}/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateBtn = document.getElementById("generateRoutine");
const userInput = document.getElementById("userInput");

/* Global variables */
let allProducts = [];
let selectedProducts = [];
let conversationHistory = [];
let currentRoutine = null;

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products and start building your routine
  </div>
`;

/* Initialize chat window */
chatWindow.innerHTML = `
  <div class="placeholder-message">
    👋 Hi! I'm your L'Oréal beauty advisor. Select some products and click "Generate Routine" to get started, or ask me any questions about skincare, haircare, or makeup!
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  if (allProducts.length === 0) {
    const response = await fetch("products.json");
    const data = await response.json();
    allProducts = data.products;
  }
  return allProducts;
}

/* Load selected products from localStorage */
function loadSelectedProducts() {
  const saved = localStorage.getItem('selectedProducts');
  if (saved) {
    selectedProducts = JSON.parse(saved);
    updateSelectedProductsDisplay();
    updateGenerateButtonState();
  }
}

/* Save selected products to localStorage */
function saveSelectedProducts() {
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(product => {
      const isSelected = selectedProducts.some(p => p.id === product.id);
      return `
        <div class="product-card ${isSelected ? 'selected' : ''}" data-product-id="${product.id}">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.brand}</p>
            <span class="brand-tag">${product.brand}</span>
            <button class="toggle-description">Show Details</button>
            <div class="product-description">${product.description}</div>
          </div>
        </div>
      `;
    })
    .join("");

  // Add click listeners for product selection
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', handleProductSelection);
  });

  // Add click listeners for description toggles
  document.querySelectorAll('.toggle-description').forEach(btn => {
    btn.addEventListener('click', handleDescriptionToggle);
  });
}

/* Handle product selection/deselection */
function handleProductSelection(e) {
  // Prevent event if clicking on the description button
  if (e.target.classList.contains('toggle-description')) {
    return;
  }

  const productId = parseInt(e.currentTarget.dataset.productId);
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) return;

  const existingIndex = selectedProducts.findIndex(p => p.id === productId);
  
  if (existingIndex > -1) {
    // Remove product
    selectedProducts.splice(existingIndex, 1);
    e.currentTarget.classList.remove('selected');
  } else {
    // Add product
    selectedProducts.push(product);
    e.currentTarget.classList.add('selected');
  }

  updateSelectedProductsDisplay();
  updateGenerateButtonState();
  saveSelectedProducts();
}

/* Handle description toggle */
function handleDescriptionToggle(e) {
  e.stopPropagation();
  const card = e.target.closest('.product-card');
  const isShowing = card.classList.contains('show-description');
  
  if (isShowing) {
    card.classList.remove('show-description');
    e.target.textContent = 'Show Details';
  } else {
    card.classList.add('show-description');
    e.target.textContent = 'Hide Details';
  }
}

/* Update selected products display */
function updateSelectedProductsDisplay() {
  if (selectedProducts.length === 0) {
    selectedProductsList.innerHTML = '<p style="color: #999; font-style: italic;">No products selected yet</p>';
    return;
  }

  const clearAllBtn = selectedProducts.length > 1 ? 
    '<button class="clear-all-btn" onclick="clearAllProducts()">Clear All</button>' : '';

  selectedProductsList.innerHTML = clearAllBtn + selectedProducts
    .map(product => `
      <div class="selected-item">
        <span>${product.name} - ${product.brand}</span>
        <button class="remove-item" onclick="removeProduct(${product.id})">&times;</button>
      </div>
    `)
    .join("");
}

/* Remove individual product */
function removeProduct(productId) {
  selectedProducts = selectedProducts.filter(p => p.id !== productId);
  updateSelectedProductsDisplay();
  updateGenerateButtonState();
  saveSelectedProducts();

  // Update visual state in product grid
  const productCard = document.querySelector(`[data-product-id="${productId}"]`);
  if (productCard) {
    productCard.classList.remove('selected');
  }
}

/* Clear all selected products */
function clearAllProducts() {
  selectedProducts = [];
  updateSelectedProductsDisplay();
  updateGenerateButtonState();
  saveSelectedProducts();

  // Update visual state in product grid
  document.querySelectorAll('.product-card.selected').forEach(card => {
    card.classList.remove('selected');
  });
}

/* Update generate button state */
function updateGenerateButtonState() {
  generateBtn.disabled = selectedProducts.length === 0;
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);
});

/* Generate hardcoded routine based on selected products */
function generateRoutine(products) {
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];
  
  let routine = {
    title: "Your Personalized Beauty Routine",
    intro: `I've created a personalized routine using ${products.length} carefully selected ${brands.length > 1 ? `products from ${brands.join(', ')}` : `${brands[0]} products`}.`,
    sections: []
  };

  // Morning routine
  const morningProducts = products.filter(p => 
    p.category === 'cleanser' || 
    p.category === 'moisturizer' || 
    p.category === 'skincare' && (p.name.includes('Vitamin C') || p.name.includes('SPF')) ||
    p.name.includes('SPF')
  );

  if (morningProducts.length > 0) {
    routine.sections.push({
      title: "Morning Routine",
      steps: generateMorningSteps(morningProducts)
    });
  }

  // Evening routine
  const eveningProducts = products.filter(p => 
    p.category === 'cleanser' || 
    p.category === 'moisturizer' || 
    p.category === 'skincare' && (p.name.includes('Retinol') || p.name.includes('PM'))
  );

  if (eveningProducts.length > 0) {
    routine.sections.push({
      title: "Evening Routine",
      steps: generateEveningSteps(eveningProducts)
    });
  }

  // Haircare routine
  const haircareProducts = products.filter(p => p.category === 'haircare' || p.category === 'hair styling' || p.category === 'hair color');
  if (haircareProducts.length > 0) {
    routine.sections.push({
      title: "Hair Care Routine",
      steps: generateHaircareSteps(haircareProducts)
    });
  }

  // Makeup routine
  const makeupProducts = products.filter(p => p.category === 'makeup');
  if (makeupProducts.length > 0) {
    routine.sections.push({
      title: "Makeup Application",
      steps: generateMakeupSteps(makeupProducts)
    });
  }

  // Special care
  const specialProducts = products.filter(p => 
    p.category === 'suncare' || 
    p.category === 'men\'s grooming' || 
    p.category === 'fragrance'
  );

  if (specialProducts.length > 0) {
    routine.sections.push({
      title: "Special Care & Finishing Touches",
      steps: generateSpecialSteps(specialProducts)
    });
  }

  // General tips
  routine.tips = generateTips(categories, brands);

  return routine;
}

function generateMorningSteps(products) {
  let steps = [];
  
  const cleanser = products.find(p => p.category === 'cleanser');
  if (cleanser) {
    steps.push(`Start with ${cleanser.name} to gently cleanse your skin and remove any overnight buildup.`);
  }

  const vitaminC = products.find(p => p.name.includes('Vitamin C'));
  if (vitaminC) {
    steps.push(`Apply ${vitaminC.name} to brighten and protect your skin with antioxidants.`);
  }

  const moisturizer = products.find(p => p.category === 'moisturizer' && !p.name.includes('PM'));
  if (moisturizer) {
    steps.push(`Follow with ${moisturizer.name} to hydrate and prep your skin for the day.`);
  }

  const spf = products.find(p => p.name.includes('SPF'));
  if (spf) {
    steps.push(`Finish with ${spf.name} for essential UV protection. Never skip sunscreen!`);
  }

  if (steps.length === 0) {
    steps.push("Apply your selected products in order: cleanser, treatments, moisturizer, and sunscreen.");
  }

  return steps;
}

function generateEveningSteps(products) {
  let steps = [];
  
  const cleanser = products.find(p => p.category === 'cleanser');
  if (cleanser) {
    steps.push(`Begin your evening routine with ${cleanser.name} to remove makeup, dirt, and pollution from the day.`);
  }

  const retinol = products.find(p => p.name.includes('Retinol'));
  if (retinol) {
    steps.push(`Apply ${retinol.name} to promote cell renewal and reduce signs of aging. Start slowly if you're new to retinol.`);
  }

  const nightMoisturizer = products.find(p => p.category === 'moisturizer' && p.name.includes('PM')) || 
                          products.find(p => p.category === 'moisturizer');
  if (nightMoisturizer) {
    steps.push(`Seal in your treatments with ${nightMoisturizer.name} for overnight hydration and repair.`);
  }

  const eyeCream = products.find(p => p.name.includes('Eye'));
  if (eyeCream) {
    steps.push(`Gently pat ${eyeCream.name} around the eye area to target specific concerns like dark circles or fine lines.`);
  }

  if (steps.length === 0) {
    steps.push("Follow a simple evening routine: cleanse thoroughly, apply treatments, and moisturize.");
  }

  return steps;
}

function generateHaircareSteps(products) {
  let steps = [];
  
  const shampoo = products.find(p => p.name.includes('Shampoo'));
  if (shampoo) {
    steps.push(`Wash your hair with ${shampoo.name}, focusing on the scalp and roots.`);
  }

  const conditioner = products.find(p => p.name.includes('Conditioner'));
  if (conditioner) {
    steps.push(`Apply ${conditioner.name} from mid-length to ends, leave for 2-3 minutes, then rinse thoroughly.`);
  }

  const hairColor = products.find(p => p.category === 'hair color');
  if (hairColor) {
    steps.push(`For hair coloring, use ${hairColor.name} following the included instructions for best results and hair health.`);
  }

  const hairspray = products.find(p => p.category === 'hair styling');
  if (hairspray) {
    steps.push(`Style as desired and finish with ${hairspray.name} to lock in your look.`);
  }

  if (steps.length === 0) {
    steps.push("Follow the basic routine: shampoo, condition, and style as needed.");
  }

  return steps;
}

function generateMakeupSteps(products) {
  let steps = [];
  
  const foundation = products.find(p => p.name.includes('Foundation'));
  if (foundation) {
    steps.push(`Create an even base with ${foundation.name}, blending outward from the center of your face.`);
  }

  const eyeshadow = products.find(p => p.name.includes('Eyeshadow') || p.name.includes('Naked'));
  if (eyeshadow) {
    steps.push(`Define your eyes with ${eyeshadow.name}, blending colors for your desired look.`);
  }

  const mascara = products.find(p => p.name.includes('Mascara'));
  if (mascara) {
    steps.push(`Enhance your lashes with ${mascara.name}, applying from root to tip in zigzag motions.`);
  }

  const lipstick = products.find(p => p.name.includes('Lipstick') || p.name.includes('Rouge'));
  if (lipstick) {
    steps.push(`Complete your look with ${lipstick.name} for a beautiful finishing touch.`);
  }

  if (steps.length === 0) {
    steps.push("Apply your makeup products in the traditional order: base, eyes, lips.");
  }

  return steps;
}

function generateSpecialSteps(products) {
  let steps = [];
  
  const suncare = products.find(p => p.category === 'suncare');
  if (suncare) {
    steps.push(`Don't forget ${suncare.name} for additional sun protection, especially during outdoor activities.`);
  }

  const mensGrooming = products.find(p => p.category === 'men\'s grooming');
  if (mensGrooming) {
    steps.push(`Apply ${mensGrooming.name} after shaving to soothe and hydrate your skin.`);
  }

  const fragrance = products.find(p => p.category === 'fragrance');
  if (fragrance) {
    steps.push(`Finish with a few spritzes of ${fragrance.name} on pulse points for a signature scent.`);
  }

  return steps;
}

function generateTips(categories, brands) {
  let tips = [
    "💡 Always patch test new products before full application",
    "💡 Consistency is key - stick to your routine for best results",
    "💡 Apply products with clean hands or tools"
  ];

  if (categories.includes('skincare')) {
    tips.push("💡 For skincare, apply thinnest to thickest consistency");
  }

  if (categories.includes('haircare')) {
    tips.push("💡 Use lukewarm water when washing hair to prevent damage");
  }

  if (brands.length > 1) {
    tips.push("💡 Your multi-brand routine combines the best of each product line");
  }

  return tips;
}

/* Hardcoded chatbot responses */
const chatResponses = {
  // Greeting patterns
  "hello": "Hello! I'm here to help you with your beauty routine. What would you like to know?",
  "hi": "Hi there! Ready to create your perfect beauty routine? Ask me anything!",
  "hey": "Hey! How can I help you with your L'Oréal products today?",
  
  // Product questions
  "cleanser": "Cleansers remove dirt, oil, and makeup. For oily skin, try foaming cleansers like CeraVe Foaming Facial Cleanser. For dry skin, cream cleansers like CeraVe Hydrating Facial Cleanser work better.",
  "moisturizer": "Moisturizers hydrate and protect your skin barrier. Look for ingredients like ceramides, hyaluronic acid, and niacinamide. Apply on damp skin for better absorption.",
  "retinol": "Retinol helps with anti-aging and skin texture. Start slowly (2-3 times per week) and always use sunscreen during the day. The CeraVe Resurfacing Retinol Serum is great for beginners.",
  "vitamin c": "Vitamin C brightens skin and provides antioxidant protection. Use in the morning before sunscreen. L'Oréal's Vitamin C serums are excellent for improving skin radiance.",
  "sunscreen": "Sunscreen is the most important anti-aging product! Use at least SPF 30 daily. La Roche-Posay Anthelios provides excellent protection without a white cast.",
  
  // Skin type questions
  "oily skin": "For oily skin, use gel or foaming cleansers, lightweight moisturizers, and oil-free products. CeraVe Foaming Cleanser and Maybelline Fit Me Foundation are great choices.",
  "dry skin": "Dry skin needs gentle, hydrating products. Try cream cleansers, rich moisturizers with ceramides, and avoid over-exfoliating. CeraVe Hydrating Cleanser and Moisturizing Cream are perfect.",
  "sensitive skin": "Sensitive skin requires fragrance-free, gentle formulas. Look for products with niacinamide and ceramides. La Roche-Posay and CeraVe are excellent sensitive skin brands.",
  "acne": "For acne-prone skin, use salicylic acid or benzoyl peroxide products. La Roche-Posay Effaclar Duo is excellent for treating breakouts without over-drying.",
  
  // Routine questions
  "morning routine": "A good morning routine: cleanser → vitamin C serum → moisturizer → sunscreen. Keep it simple but consistent!",
  "evening routine": "Evening routine: cleanser → treatment (retinol/acids) → moisturizer → eye cream if needed. This is when your skin repairs itself.",
  "how often": "Most products can be used daily, but start retinol 2-3x per week. Exfoliating products should be used 1-2x per week maximum.",
  
  // Hair questions
  "hair": "For healthy hair, use sulfate-free shampoos, deep condition weekly, and protect from heat. L'Oréal Elvive and Kérastase offer excellent hair care solutions.",
  "frizzy hair": "Combat frizz with moisturizing shampoos, leave-in treatments, and avoid over-washing. Garnier Fructis Sleek & Shine helps control frizz for up to 72 hours.",
  "damaged hair": "Repair damage with protein-rich treatments and gentle handling. L'Oréal Elvive Total Repair 5 targets five signs of damage.",
  
  // Makeup questions
  "foundation": "Choose foundation based on your skin type: matte for oily skin, hydrating for dry skin. L'Oréal and Maybelline offer great options for all skin types.",
  "mascara": "For volume, try L'Oréal Voluminous. For length and separation, Maybelline Lash Sensational is perfect. Always remove gently with makeup remover.",
  "lipstick": "YSL Rouge Volupté provides beautiful color with hydrating benefits. For everyday wear, choose MLBB (my lips but better) shades.",
  
  // Brand questions
  "cerave": "CeraVe is developed with dermatologists and features ceramides, hyaluronic acid, and MVE technology for long-lasting hydration. Perfect for sensitive skin.",
  "loreal": "L'Oréal Paris combines innovation with accessibility, offering high-performance products for skincare, haircare, and makeup at drugstore prices.",
  "lancome": "Lancôme is luxury skincare and makeup with advanced anti-aging technology. Their Génifique serum and foundations are iconic.",
  "maybelline": "Maybelline New York offers trendy, high-quality makeup at affordable prices. Great for experimenting with new looks!",
  
  // Ingredient questions
  "hyaluronic acid": "Hyaluronic acid holds 1000x its weight in water! It plumps skin and reduces fine lines. Use on damp skin and seal with moisturizer.",
  "niacinamide": "Niacinamide (Vitamin B3) reduces oil production, minimizes pores, and calms irritation. It's gentle enough for daily use.",
  "ceramides": "Ceramides restore and maintain your skin barrier. They're essential for healthy, hydrated skin and are found in many CeraVe products.",
  
  // General advice
  "routine order": "Skincare order: cleanser → toner → serum → moisturizer → sunscreen (AM) or night cream (PM). Thinnest to thickest consistency!",
  "patch test": "Always patch test new products on your inner arm for 24-48 hours before applying to your face. Better safe than sorry!",
  "results": "Most skincare products take 4-6 weeks to show results. Be patient and consistent with your routine!",
  
  // Troubleshooting
  "breakout": "New breakouts could be purging (good with actives) or a reaction (bad). If it persists beyond 6 weeks, discontinue the product.",
  "irritation": "If you experience irritation, stop using new products immediately. Stick to gentle, fragrance-free basics until skin calms down.",
  
  // Default responses
  "thanks": "You're welcome! I'm here whenever you need beauty advice. Your skin will thank you for taking such good care of it!",
  "bye": "Goodbye! Remember to be consistent with your routine and protect your skin daily. You've got this! ✨"
};

/* Handle chat form submission */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const message = userInput.value.trim();
  if (!message) return;

  // Add user message to chat
  addChatMessage(message, 'user');
  
  // Generate response
  const response = generateResponse(message);
  
  // Add bot response to chat
  setTimeout(() => {
    addChatMessage(response, 'bot');
  }, 500);

  // Clear input
  userInput.value = '';
  
  // Save conversation
  conversationHistory.push({
    user: message,
    bot: response,
    timestamp: new Date().toISOString()
  });
});

/* Add message to chat window */
function addChatMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${sender}-message`;
  
  if (sender === 'bot' && typeof message === 'object') {
    // Handle routine display
    messageDiv.innerHTML = formatRoutineResponse(message);
  } else {
    messageDiv.textContent = message;
  }
  
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Format routine response */
function formatRoutineResponse(routine) {
  let html = `<h4>${routine.title}</h4><p>${routine.intro}</p>`;
  
  routine.sections.forEach(section => {
    html += `<div class="routine-section">
      <h5>${section.title}</h5>
      <ol>
        ${section.steps.map(step => `<li>${step}</li>`).join('')}
      </ol>
    </div>`;
  });
  
  if (routine.tips) {
    html += `<div class="routine-section">
      <h5>Pro Tips</h5>
      <ul>
        ${routine.tips.map(tip => `<li>${tip}</li>`).join('')}
      </ul>
    </div>`;
  }
  
  return html;
}

/* Generate response based on user input */
function generateResponse(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Check if asking about current routine
  if (currentRoutine && (message.includes('routine') || message.includes('step') || message.includes('order'))) {
    return generateRoutineFollowUp(message);
  }
  
  // Check for selected products questions
  if (message.includes('selected') || message.includes('products i chose')) {
    if (selectedProducts.length === 0) {
      return "You haven't selected any products yet! Browse through the categories above and click on products you'd like to include in your routine.";
    }
    return `You've selected ${selectedProducts.length} products: ${selectedProducts.map(p => `${p.name} by ${p.brand}`).join(', ')}. Click "Generate Routine" to get personalized recommendations!`;
  }
  
  // Find matching response
  for (const [key, response] of Object.entries(chatResponses)) {
    if (message.includes(key)) {
      return response;
    }
  }
  
  // Context-aware responses based on selected products
  if (selectedProducts.length > 0) {
    const categories = [...new Set(selectedProducts.map(p => p.category))];
    
    if (message.includes('how') && message.includes('use')) {
      return `Based on your selected ${categories.join(' and ')} products, I'd recommend generating your complete routine first. Click the "Generate Routine" button and I'll give you step-by-step instructions!`;
    }
    
    if (message.includes('when')) {
      return `Great question! The timing depends on your products. Generally, cleansers and treatments work well morning and night, while sunscreen is for daytime only. Generate your routine for specific timing!`;
    }
  }
  
  // Smart fallback responses
  const helpfulResponses = [
    "I'd love to help! Try asking about specific products, skin concerns, or routine steps. You can also select products above and generate a personalized routine.",
    "I'm here to help with your beauty routine! Ask me about skincare ingredients, product recommendations, or how to use your selected products.",
    "Let me assist you! I can answer questions about the L'Oréal brands, skincare routines, makeup application, or hair care. What would you like to know?",
    "I'm your personal beauty advisor! Feel free to ask about product ingredients, skin types, routine order, or any beauty concerns you have."
  ];
  
  return helpfulResponses[Math.floor(Math.random() * helpfulResponses.length)];
}

/* Generate follow-up responses about current routine */
function generateRoutineFollowUp(message) {
  if (!currentRoutine) {
    return "You haven't generated a routine yet! Select some products and click 'Generate Routine' to get started.";
  }
  
  if (message.includes('morning')) {
    const morningSection = currentRoutine.sections.find(s => s.title.includes('Morning'));
    if (morningSection) {
      return `Here's your morning routine:\n${morningSection.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
    }
    return "Your current routine doesn't include specific morning steps. Try adding a cleanser, moisturizer, or sunscreen!";
  }
  
  if (message.includes('evening') || message.includes('night')) {
    const eveningSection = currentRoutine.sections.find(s => s.title.includes('Evening'));
    if (eveningSection) {
      return `Here's your evening routine:\n${eveningSection.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
    }
    return "Your current routine doesn't include specific evening steps. Try adding a gentle cleanser or night moisturizer!";
  }
  
  if (message.includes('order') || message.includes('step')) {
    return "The general rule is: cleanser → treatments (serums) → moisturizer → sunscreen (AM only). Your generated routine follows this optimal order!";
  }
  
  if (message.includes('how often') || message.includes('frequency')) {
    return "Most products can be used daily, but start retinol 2-3x per week. Exfoliating products should be used 1-2x per week. Listen to your skin!";
  }
  
  return "I can help you understand your routine better! Ask me about morning vs evening steps, product order, or how often to use specific products.";
}

/* Generate routine button handler */
generateBtn.addEventListener('click', () => {
  if (selectedProducts.length === 0) {
    addChatMessage("Please select at least one product before generating a routine!", 'bot');
    return;
  }

  // Show loading message
  addChatMessage("Creating your personalized routine... ✨", 'bot');
  
  setTimeout(() => {
    currentRoutine = generateRoutine(selectedProducts);
    addChatMessage(currentRoutine, 'bot');
    
    // Follow up message
    setTimeout(() => {
      addChatMessage("Your routine is ready! Feel free to ask me questions about any of these steps, timing, or how to use specific products. I'm here to help! 💄", 'bot');
    }, 1000);
  }, 1500);
});

/* Initialize the application */
document.addEventListener('DOMContentLoaded', () => {
  loadSelectedProducts();
  updateGenerateButtonState();
  
  // Clear placeholder in chat window if user starts typing
  userInput.addEventListener('focus', () => {
    if (chatWindow.innerHTML.includes('placeholder-message')) {
      chatWindow.innerHTML = '';
    }
  });
});

/* Expose functions globally for onclick handlers */
window.removeProduct = removeProduct;
window.clearAllProducts = clearAllProducts;