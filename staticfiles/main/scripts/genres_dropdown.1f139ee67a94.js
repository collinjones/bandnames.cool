document.addEventListener('DOMContentLoaded', function() {

    // Show dropdown when search box is clicked
    const searchBox = document.getElementById('genre-search');
    searchBox.addEventListener('click', function(event) {
        document.querySelector('.genre-dropdown').style.display = 'block';
        event.stopPropagation(); // Prevents click event from reaching the window
    });

    // Toggle category content on title click and prevent dropdown from closing
    const categoryTitles = document.querySelectorAll('.genre-category-title');
    categoryTitles.forEach(function(title) {
        title.addEventListener('click', function(event) {
            let categoryContent = this.nextElementSibling;
            categoryContent.style.display = categoryContent.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation(); // Prevents click event from closing the dropdown
        });
    });

    // Hide dropdown when clicking outside of the search box
    window.addEventListener('click', function() {
        let dropdowns = document.getElementsByClassName("genre-dropdown");
        for (let dropdown of dropdowns) {
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            }
        }
    });

    // Search functionality
    searchBox.addEventListener('keyup', function() {
        let filter = searchBox.value.toLowerCase();
        let categories = document.querySelectorAll('.genre-category');
        let noResultsElement = document.getElementById('no-results');
        console.log(noResultsElement)
        let anyVisible = false; // Flag to track if any options are visible


        categories.forEach(function(category) {
            let title = category.querySelector('.genre-category-title').textContent.toLowerCase();
            let content = category.querySelector('.genre-category-content');
            let options = content.getElementsByTagName('span');
            let match = title.indexOf(filter) > -1;
            

            for (let option of options) {
                if (option.textContent.toLowerCase().indexOf(filter) > -1 || match) {
                    option.style.display = "";
                } else {
                    option.style.display = "none";
                }
            }

            if (category.style.display !== "none") {
                anyVisible = true;
            }

            // If the category title or any option matches, keep the category visible
            category.style.display = match || Array.from(options).some(o => o.style.display === "") ? "" : "none";
        });
        noResultsElement.style.display = anyVisible ? "none" : "block";
    });

    // Select dropdown content
    const dropdownOptions = document.querySelectorAll('.genre-dropdown span');
    dropdownOptions.forEach(function(option) {
        option.addEventListener('click', function(event) {
            searchBox.value = event.target.textContent;
            document.querySelector('.genre-dropdown').style.display = 'none';
            event.stopPropagation(); // Prevents click event from reaching the window
        });
    });
});