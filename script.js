// Script: Live search + age-pill filtering + small UX helpers
(function(){
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const pillsContainer = document.getElementById('agePills');
  const pills = Array.from(document.querySelectorAll('#agePills .pill'));
  const courseCards = Array.from(document.querySelectorAll('.course'));
  const noResults = document.getElementById('noResults');

  // helper: normalize string
  function norm(str){ return (str||'').toString().trim().toLowerCase(); }

  // read currently active pill (single-select)
  function getActiveAge(){
    const active = pills.find(p => p.classList.contains('active'));
    return active ? active.dataset.age : null;
  }

  // Toggle pill click (single active at a time)
  pills.forEach(p => {
    p.addEventListener('click', () => {
      // Toggle behavior: clicking same removes it
      if(p.classList.contains('active')){
        p.classList.remove('active');
      } else {
        pills.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
      }
      filter();
    });
    // keyboard accessibility
    p.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault(); p.click();
      }
    });
  });

  // Core filter: search + age
  function filter(){
    const q = norm(searchInput.value);
    const activeAge = getActiveAge();
    let visibleCount = 0;

    courseCards.forEach(card => {
      const title = norm(card.dataset.title || card.querySelector('.title')?.textContent || '');
      const ages = norm(card.dataset.ages || '');
      // search match (title only per requirement)
      const matchesSearch = q === '' ? true : title.includes(q);

      // age match: if no active age, show; otherwise check if that age appears in data-ages
      let matchesAge = true;
      if(activeAge){
        // simple matching: check if activeAge substring exists in data-ages
        matchesAge = ages.includes(activeAge);
      }

      if(matchesSearch && matchesAge){
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // toggle no results
    if(visibleCount === 0){
      noResults.hidden = false;
    } else {
      noResults.hidden = true;
    }
  }

  // Live search
  searchInput.addEventListener('input', () => filter());

  // Enter triggers
  searchInput.addEventListener('keydown', e => {
    if(e.key === 'Enter'){ e.preventDefault(); filter(); }
  });

  // click search button
  searchBtn.addEventListener('click', (e) => { e.preventDefault(); filter(); });

  // initial filter (show all)
  filter();

})();


document.addEventListener("DOMContentLoaded", function() {
  // Always show the modal when page loads
  document.getElementById("welcome-modal").style.display = "flex";

  // Close button
  document.getElementById("close-modal").addEventListener("click", function() {
  const overlay = document.getElementById("welcome-modal");
  const modal = overlay.querySelector(".modal-content");

  // Add fade-out animation
  modal.classList.add("fade-out");
  overlay.classList.add("fade-out");

  // Remove from DOM after animation finishes
  setTimeout(() => {
    overlay.style.display = "none";
    modal.classList.remove("fade-out");
    overlay.classList.remove("fade-out");
  }, 300); // match animation duration
});
});
