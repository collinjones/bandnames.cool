document.addEventListener('DOMContentLoaded', function() { 

    // Show dropdown when search box is clicked
    const searchBox = document.getElementById('genre-search');
    searchBox.addEventListener('click', function(event) { 
        document.querySelector('.genre-dropdown').style.display = 'block';
        event.stopPropagation(); // Prevents click event from reaching the window
    });

    // Toggle category content on title click and prevent dropdown from closing
    const categoryTitles = document.querySelectorAll('.genre-category');
    categoryTitles.forEach(function(title) {
        title.addEventListener('click', function(event) {
            // Collapse all other categories
            categoryTitles.forEach(function(otherTitle) {
                if (otherTitle !== title && otherTitle.nextElementSibling) {
                    otherTitle.nextElementSibling.style.display = 'none';
                }
            });

            // Toggle the clicked category
            let categoryContent = this.nextElementSibling;
            console.log(categoryContent)
            if (categoryContent) { // Check if nextElementSibling exists
                categoryContent.style.display = categoryContent.style.display === 'block' ? 'none' : 'block';
            }
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

    searchBox.addEventListener('keyup', function() {
        
        let filter = searchBox.value.toLowerCase();
        let categories = document.querySelectorAll('.genre-category');
        let noResultsElement = document.querySelector('#no-results');
        let anyVisible = false; // Flag to track if any options are visible
        let visibleOptionsCount = 0; // Count of visible options
    
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
                    visibleOptionsCount++; // Increment count for each visible option
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
    
        // Automatically expand all categories if 10 or less options are visible
        if (visibleOptionsCount <= 10) {
            categories.forEach(function(category) {
                let content = category.querySelector('.genre-category-content');
                if (content) {
                    content.style.display = "block";
                }
            });
        } else {
            // Collapse all categories if more than 10 options are visible or search box is empty
            categories.forEach(function(category) {
                let content = category.querySelector('.genre-category-content');
                if (content) {
                    content.style.display = "none";
                }
            });
        }
    
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

    let submitGenreButton = document.getElementById('new-genre-submit');
    submitGenreButton.addEventListener('click', function() {
        resetDropdown();
    });
});

function resetDropdown() {
    let categories = document.querySelectorAll('.genre-category');
    categories.forEach(function(category) {
        category.style.display = ""; // Show all categories
        let content = category.querySelector('.genre-category-content');
        if (content) {
            content.style.display = "none"; // Collapse all category contents
        }
    });

    let options = document.querySelectorAll('.genre-category-content span');
    options.forEach(function(option) {
        option.style.display = ""; // Show all options
    });

    let noResultsElement = document.querySelector('#no-results');
    noResultsElement.style.display = "none"; // Hide the "No results" message
}

document.addEventListener('DOMContentLoaded', function() { 

    // Show dropdown when search box is clicked
    const newBandnameGenreSearchBox = document.getElementById('new-bandname-genre-search');
    newBandnameGenreSearchBox.addEventListener('click', function(event) { 
        re = document.querySelector('#new-bandname-genre-content')
        console.log(re)
        re.style.display = 'block';
        event.stopPropagation(); // Prevents click event from reaching the window
    });

    // Toggle category content on title click and prevent dropdown from closing
    const categoryTitles = document.querySelectorAll('.genre-category-title');
    categoryTitles.forEach(function(title) {
        title.addEventListener('click', function(event) {
            // Collapse all other categories
            categoryTitles.forEach(function(otherTitle) {
                if (otherTitle !== title && otherTitle.nextElementSibling) {
                    otherTitle.nextElementSibling.style.display = 'none';
                }
            });

            // Toggle the clicked category
            let categoryContent = this.nextElementSibling;
            if (categoryContent) { // Check if nextElementSibling exists
                categoryContent.style.display = categoryContent.style.display === 'block' ? 'none' : 'block';
            }
            event.stopPropagation(); // Prevents click event from closing the dropdown
        });
    });

    // Hide dropdown when clicking outside of the search box
    window.addEventListener('click', function() {
        let dropdowns = document.querySelectorAll('#new-bandname-genre-content');
        for (let dropdown of dropdowns) {
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            }
        }
    });

    newBandnameGenreSearchBox.addEventListener('keyup', function() {
        
        let filter = newBandnameGenreSearchBox.value.toLowerCase();
        let categories = document.querySelectorAll('.genre-category');
        let noResultsElement = document.querySelector('#no-results');
        let anyVisible = false; // Flag to track if any options are visible
        let visibleOptionsCount = 0; // Count of visible options
    
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
                    visibleOptionsCount++; // Increment count for each visible option
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
    
        // Automatically expand all categories if 10 or less options are visible
        if (visibleOptionsCount <= 10) {
            categories.forEach(function(category) {
                let content = category.querySelector('.genre-category-content');
                if (content) {
                    content.style.display = "block";
                }
            });
        } else {
            // Collapse all categories if more than 10 options are visible or search box is empty
            categories.forEach(function(category) {
                let content = category.querySelector('.genre-category-content');
                if (content) {
                    content.style.display = "none";
                }
            });
        }
    
        // Display the "Nothing Found" message if no categories or options are visible
        noResultsElement.style.display = anyVisible ? "none" : "block";
    });

    // Select dropdown content
    const dropdownOptions = document.querySelectorAll('#new-bandname-genre-content span');
    dropdownOptions.forEach(function(option) {
        option.addEventListener('click', function(event) {
            newBandnameGenreSearchBox.value = event.target.textContent;
            document.querySelector('#new-bandname-genre-content').style.display = 'none';
            event.stopPropagation(); // Prevents click event from reaching the window
        });
    });

    let submitGenreButton = document.getElementById('new-genre-submit');
    submitGenreButton.addEventListener('click', function() {
        resetDropdown();
    });
});

function resetDropdown() {
    let categories = document.querySelectorAll('.genre-category');
    categories.forEach(function(category) {
        category.style.display = ""; // Show all categories
        let content = category.querySelector('.genre-category-content');
        if (content) {
            content.style.display = "none"; // Collapse all category contents
        }
    });

    let options = document.querySelectorAll('.genre-category-content span');
    options.forEach(function(option) {
        option.style.display = ""; // Show all options
    });

    let noResultsElement = document.querySelector('#no-results');
    noResultsElement.style.display = "none"; // Hide the "No results" message
}