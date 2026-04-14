document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded");
  console.log("Anime.js loaded?", typeof anime);

  // ===== Animate on Scroll Function =====
  function animateOnScroll(elements) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000,
            easing: "easeOutExpo",
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    elements.forEach(el => observer.observe(el));
  }

  // ===== Fade In Sections =====
  const sections = document.querySelectorAll("main section");
  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = "translateY(20px)";
  });
  animateOnScroll(sections);

  // ===== Animate Cyber Lines =====
  ["#cyber-line-1 line", "#cyber-line-2 line", "#cyber-line-3 line"].forEach((selector, i) => {
    anime({
      targets: selector,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 3000 + i * 1000,
      easing: "linear",
      loop: true,
      direction: "alternate",
    });
  });

  // ===== SVG Hover Effects =====
  document.querySelectorAll(".main-bg-svg").forEach(svg => {
    svg.addEventListener("mouseenter", () => {
      anime({
        targets: svg,
        scale: 1.2,
        opacity: 0.6,
        duration: 600,
        easing: "easeOutElastic(1, .8)",
      });
    });
    svg.addEventListener("mouseleave", () => {
      anime({
        targets: svg,
        scale: 1,
        opacity: 0.3,
        duration: 400,
        easing: "easeOutQuad",
      });
    });
  });

  // ===== Fetch GitHub Repos =====
  const repoList = document.getElementById("repo-list");
  const API_URL = "https://api.github.com/orgs/Derbyshire-Unlimited/repos";

  if (repoList) {
    fetch(API_URL)
      .then(res => res.ok ? res.json() : Promise.reject("GitHub API error"))
      .then(repos => {
        repoList.innerHTML = "";
        if (!repos.length) {
          repoList.innerHTML = "<p>No public repositories found.</p>";
          return;
        }

        repos.forEach(repo => {
          const card = document.createElement("div");
          card.className = "repo-card";
          card.style.opacity = 0;
          card.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
            <p>${repo.description || "No description provided."}</p>
          `;
          repoList.appendChild(card);
        });

        animateOnScroll(document.querySelectorAll(".repo-card"));
      })
      .catch(error => {
        console.error("GitHub Fetch Error:", error);
        repoList.innerHTML = "<p class='error'>Failed to load repositories.</p>";
      });
  }

  // ===== Modal Section Logic =====
  const modal = document.getElementById("section-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  const contentMap = {
    about: `
      <h3>About Devign </h3>
      <p>We're a creative tech collective for makers, dreamers, and doers. Our work is a fusion of imagination and innovation.</p>
    `,
    projects: `
      <h3>Projects</h3>
      <p>Check out our open-source repositories and WIP builds hosted on GitHub.</p>
    `,
    creatives: `
    <h3>Creatives</h3>
    <p>
      Keyayco 
    - Lead Developer
    
    Alessandro Coverdale
     - Lead Designer.</p>
  `,
    contact: `
      <h3>Contact</h3>
      <p>Reach us via GitHub or drop a line at hello@derbyshire.dev.</p>
    `,
  };

  // Section click opens modal
  sections.forEach(section => {
    const id = section.id;
    if (!contentMap[id]) return; // Skip if no modal content for this section

    section.addEventListener("click", () => {
      // Toggle neon
      section.querySelectorAll("p, h2").forEach(el => {
        el.classList.toggle("neon-orange");
      });

      modalBody.innerHTML = contentMap[id];
      modalBody.className = "";
      modalBody.classList.add(`modal-${id}`);

      modal.classList.remove("hidden");
      anime({
        targets: "#section-modal .modal-content",
        opacity: [0, 1],
        translateY: [-50, 0],
        duration: 600,
        easing: "easeOutExpo",
      });
    });
  });

  // Modal close via button
  modalClose?.addEventListener("click", () => {
    anime({
      targets: "#section-modal .modal-content",
      opacity: [1, 0],
      translateY: [0, -50],
      duration: 400,
      easing: "easeInExpo",
      complete: () => modal.classList.add("hidden"),
    });
  });

  // Modal close via background click
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      anime({
        targets: "#section-modal .modal-content",
        opacity: [1, 0],
        translateY: [0, -50],
        duration: 400,
        easing: "easeInExpo",
        complete: () => modal.classList.add("hidden"),
      });
    }
  });
});