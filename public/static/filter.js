(function () {
  var stateFilter = document.getElementById("filter-state");
  var statusFilter = document.getElementById("filter-status");
  var categoryFilter = document.getElementById("filter-category");
  var searchFilter = document.getElementById("filter-search");
  var billList = document.getElementById("bills-grid");
  var noResults = document.getElementById("no-bills");

  if (!stateFilter || !billList) return;

  function applyFilters() {
    var state = stateFilter.value;
    var status = statusFilter.value;
    var category = categoryFilter.value;
    var search = searchFilter.value.toLowerCase();
    var cards = billList.querySelectorAll(".bill-card");
    var visible = 0, signed = 0, active = 0, failed = 0;

    cards.forEach(function (card) {
      var show = (!state || card.dataset.state === state)
        && (!status || card.dataset.status === status)
        && (!category || (card.dataset.categories || "").split(",").indexOf(category) !== -1)
        && (!search || (card.dataset.search || "").indexOf(search) !== -1);
      card.style.display = show ? "" : "none";
      if (show) {
        visible++;
        var s = card.dataset.status;
        if (s === "Signed Into Law" || s === "Lawsuit Filed, Temporarily Enjoined" || s === "Lawsuit Filed, Law in Effect") signed++;
        else if (s === "Vetoed" || s === "Failed" || s === "Law Ruled Unconstitutional") failed++;
        else active++;
      }
    });

    noResults.style.display = visible === 0 ? "" : "none";
    var el;
    el = document.getElementById("stat-total"); if (el) el.textContent = visible;
    el = document.getElementById("stat-signed"); if (el) el.textContent = signed;
    el = document.getElementById("stat-progress"); if (el) el.textContent = active;
    el = document.getElementById("stat-failed"); if (el) el.textContent = failed;
  }

  stateFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  searchFilter.addEventListener("input", applyFilters);

  var resetBtn = document.getElementById("filter-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      stateFilter.value = "";
      statusFilter.value = "";
      categoryFilter.value = "";
      searchFilter.value = "";
      applyFilters();
    });
  }
})();
