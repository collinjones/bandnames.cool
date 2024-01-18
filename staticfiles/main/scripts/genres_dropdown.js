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
            try {
                let categoryContent = this.nextElementSibling;
                categoryContent.style.display = categoryContent.style.display === 'block' ? 'none' : 'block';
                event.stopPropagation(); // Prevents click event from closing the dropdown
            } catch (error) {
                // Do nothing if there is no next element
            }
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
        let noResultsElement = document.querySelector('#no-results');
        let anyVisible = false; // Flag to track if any options are visible
    
        categories.forEach(function(category) {
            let title = category.querySelector('.genre-category-title').textContent.toLowerCase();
            let content = category.querySelector('.genre-category-content');

            try {
                var options = content.getElementsByTagName('span');
            } catch (error) {
                var options = [];
            }

            let match = title.indexOf(filter) > -1;
            let categoryVisible = false; // Flag for visibility of current category
    
            for (let option of options) {
                if (option.textContent.toLowerCase().indexOf(filter) > -1 || match) {
                    option.style.display = "";
                    categoryVisible = true;
                } else {
                    option.style.display = "none";
                }
            }
    
            // Update the category display based on match and options visibility
            category.style.display = categoryVisible ? "" : "none";
    
            // Update anyVisible if the category or any of its options are visible
            if (categoryVisible) {
                anyVisible = true;
            }
        });
    
        // Display the "Nothing Found" message if no categories or options are visible
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