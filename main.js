const anime = require("animejs");
const tippy = require("tippy.js");
const imagesloaded = require("imagesloaded");

// utilities for element selection
const get = (selector, scope) => {
  scope = scope ? scope : document;
  return scope.querySelector(selector);
};

const getAll = (selector, scope) => {
  scope = scope ? scope : document;
  return scope.querySelectorAll(selector);
};

// DOM elements
const nav = get("nav");
const profile = get("#profile");
const loading = get("#loading");
const content = get("#content");
const toggle = get(".toggle");

// Animation for avatar rotation
const avatarAnimation = anime({
  targets: '#avatar #moon',
  rotate: '1turn',
  transformOrigin: "center center 0",
  duration: 5000
});

// Animation for sidenav categories
const showSidenavCategories = anime({
  targets: '#sidenav-categories li',
  translateY: [-10, 0],
  duration: 1200,
  opacity: [0,1],
  delay: function(el, i) { 
    return i * 60; 
  }
});

// Utility function to check if an element is hidden
function isHidden(el) {
  return (el.offsetParent === null);
}

// Removes the loading screen with fade-out animation
function removeLoadingScreen () {
  anime({
    targets: "#loading",
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    complete: () => {
      loading.style.display = "none";
    }
  });
}

// Infinite rotation animation for morphing moon
anime({
  targets: '#morphing #moon',
  rotate: '1turn',
  transformOrigin: "center center 0",
  duration: 5000,
  loop: true
});

// Adjust layout and toggle stats visibility on window resize
window.addEventListener("resize", () => {
  if(window.innerWidth > 768) {
    if (get("[data-tab='section-stats']").classList.contains('active')) {
      get("[data-tab='section-library']").click();
    }
    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      content.classList.add("flex");
      profile.style.top = 0;
    }
  }
});

// Delayed loading animation to ensure images are loaded
setTimeout(() => {
  imagesloaded(get("body"), () => {
    let tabs = getAll(".js-tab");
    let panes = getAll(".js-tab-pane");
    let sidenavCategoriesTrigger = get("#sidenav-categories-trigger");
    let sidenavCategories = get("#sidenav-categories");
    let sidenavIcon = get("#sidenav-icon");
    let books = getAll(".js-book");
    let mobileReoadTriggers = getAll(".mobile-home-trigger");
  
    removeLoadingScreen();
  
    // Bind click event to sidenav toggle
    sidenavCategoriesTrigger.addEventListener("click", sidenavClick);
  
    // Bind click event to tabs for switching panes
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", tabClick);
    }
  
    // Reload the page when mobile triggers are clicked
    for (let i = 0; i < mobileReoadTriggers.length; i++) {
      mobileReoadTriggers[i].addEventListener("click", event => {
        location.reload();
      });
    }
  
    // Initialize tooltips for book elements
    for (var i = 0; i < books.length; i++) {
      tippy(books[i], {
        html: "#popup",
        placement: "right",
        theme: "light rounded",
        arrow: true,
        arrowTransform: "scaleX(1.3)",
        distance: 20,
        maxWidth: "200px",
        animation: "fade",
        trigger: "click",
        interactive: true,
      });
    }
  
    // Enable/disable tooltips based on device type
    tippy.browser.onUserInputChange = type => {
      const method = type === 'touch' || this.window.innerWidth < 768 ? 'disable' : 'enable';
      for (let i = 0; i < books.length; i++) {
        books[i]._tippy[method]();
      }
    };
  
    // Toggle visibility of sidenav categories
    function sidenavClick (event) {
      if (sidenavCategories.classList.contains("hidden")) {
        sidenavCategories.classList.remove("hidden");
        sidenavIcon.classList.remove("rotate");
        showSidenavCategories.restart();
      } else {
        sidenavCategories.classList.add("hidden");
        sidenavIcon.classList.add("rotate");
      }
    }
  
    // Tab click handler for showing active pane
    function tabClick (event) {
      let clickedTab = event.target;
      let activePane = get(`#${clickedTab.getAttribute("data-tab")}`);
  
      // Remove active classes from all tabs and panes
      for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
      }
      for (var i = 0; i < panes.length; i++) {
        panes[i].classList.remove('active');
      }
  
      // Add active class to clicked tab and its corresponding pane
      clickedTab.classList.add('active');
      activePane.classList.add('active');
    }
  });
}, 1000);

// Mobile navigation trigger event
get("#mobile-nav-trigger").addEventListener("click", event => {
  if (isHidden(nav)) {
    toggle.classList.add("open");
    nav.classList.remove("hidden");
  } else {
    toggle.classList.remove("open");
    nav.classList.add("hidden");
  }
});

// Mobile profile trigger event
get("#mobile-profile-trigger").addEventListener("click", event => {
  profile.classList.remove("hidden");
  profile.style.top = "63px";
  content.classList.remove("flex");
  content.classList.add("hidden");
  nav.classList.add("hidden");
  toggle.classList.remove("open");
});

// Avatar hover animation handlers
get("#avatar").addEventListener("mouseenter", event => {
  avatarAnimation.restart();
}, false);

get("#avatar").addEventListener("mouseleave", event => {
  avatarAnimation.reverse();
}, false);
