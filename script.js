const API_KEY = "2b6217c6565546c5a7a21ba07dee63da";

// DOM Elements

const newsContainer =document.getElementById("newsContainer");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

window.addEventListener("load", () =>{
    fetchTopNews("technology");
});

function showLoader() {
    loader.style.display = "block";
}

function hideLoader(){
    loader.style.display = "none";
}

async function fetchTopNews(category){
    try{
        showLoader();
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
        );
        if (!response.ok){
            throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        renderNews(data.articles);

    }catch(error){
        showError(error.message);
    }finally{
        hideLoader();
    }
}
async function searchNews(keyword){
    try{
        showLoader();
        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${keyword}&sortBy=publishedAt&language=en&apiKey=${API_KEY}` 
        );
         if (!response.ok){
            throw new Error("Search failed");
         }
          const data = await response.json();
           renderNews(data.articles);
    } catch(error){
        showError(error.message);

    }finally{
       hideLoader(); 
    }
}
function renderNews(articles) {
     newsContainer.innerHTML = "";
     if (!articles || articles.length === 0){
         newsContainer.innerHTML = `<h2 class="error">No News Found</h2>`;
         return;
     }
      articles.forEach(article =>{
         const card = document.createElement("div");
         card.classList.add("card");
         card.innerHTML = `
         <img
         src="${article.urlToImage || "https://via.placeholder.com/400x250"}"
          alt="News Image"
          >
          <div class="card-content">
            <h3>${article.title || "No Title"}</h3>
            <p>
             ${article.description || "No Description Available"}
            </p>
              <div class="meta">
                <span>${article.source.name}</span>
                 <span>
                 ${new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  </div> 
                  <a
                   class="read-more"
                   href="${article.url}"
                    target="_blank" 
                    >
                      Read More
                   </a>  
                     </div>
                     `;   

             newsContainer.appendChild(card);
      });

      };
      function showError(message) {
        newsContainer.innerHTML = `
         <h2 class="error">
           ${message}
            </h2>
            `;
      }
      searchBtn.addEventListener("click", () => {
          const keyword = searchInput.value.trim();
          if (keyword){
            searchNews(keyword);
          }

      });
      searchInput.addEventListener("keydown", (e) =>{
         if (e.key === "Enter") {
            const keyword = searchInput.value.trim();
         if (keyword){
            searchNews(keyword);
         }
         }
      });
      const categoryButtons =document.querySelectorAll(".categories button");
    categoryButtons.forEach(button => {
         button.addEventListener("click", () =>{
            const category = button.dataset.category;
             fetchTopNews(category);
         });
    });
