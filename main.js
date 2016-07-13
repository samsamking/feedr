/**
 * Project 2: Feedr
 * ====
 *
 * See the README.md for instructions
 */
(function() {
	var mashableUrl = 'https://crossorigin.me/http://mashable.com/stories.json';
	var redditUrl = 'https://crossorigin.me/https://www.reddit.com/top.json';
	var container = document.querySelector('#container')
	var header = document.querySelector('header')
	var state = {
		headerItems: 
		[
			{
			 source:"Mashable"
			},
			{
			 source:"Reddit",
			}
			
		],
		articleItems:[],
		findResult:false
	}

	/*fetch data from reddit*/
	fetch(redditUrl)
		.then((response) => {
			renderLoading(state, container)
			return response.json()
		}).then((result) => {
			result.data.children.forEach((item) => {
			if (item.data.thumbnail == "" || item.data.thumbnail == "default" || item.data.thumbnail == "self" ){
				item.data.thumbnail = "images/article_placeholder_1.jpg"
			}
			var resultData = {
				imageUrl: item.data.thumbnail,
				url: item.data.url,
				title: item.data.title,
				impressions: item.data.ups,
				subreddit:item.data.subreddit,
				description:item.data.title,
				label:"reddit",
				feedPopup:false,
				searchResult:false
				
			}
			state.articleItems.push(resultData);
		})
		renderArticleList(state, container)
	
	}).catch((err)=>{
		alert('Error!',err);
	});
	
	/*fetch data from mashable*/
	fetch(mashableUrl)
		.then((response) => {
			renderLoading(state, container)
			return response.json()
		}).then((result) => {
			result.new.forEach((item) => {
			if (item.image == "" || item.image == "default" || item.image == "self" ){
				item.image = "images/article_placeholder_1.jpg"
			}
			var resultData = {
				imageUrl: item.image,
				url: item.link,
				title: item.display_title,
				impressions: item.shares.total,
				subreddit:item.channel,
				description:item.content.plain,
				label:"mashable",
				feedPopup:false,
				searchResult:false
				
			}
			state.articleItems.push(resultData);
			
		})
		renderArticleList(state, container)
	}).catch((err)=>{
		alert('Error!',err);
	});

	/*calling header*/
	renderHeader(state, header)
	
	/*render each header item*/	
	function renderHeaderItem(headerItem){
		return `
			<a href="#" class="clickMe" data-label="${headerItem.source}">${headerItem.source}</a>
		`
	}
	
	/*render header*/	
	function renderHeader(state, into){
		into.innerHTML = `
			<section class="wrapper">
			  <a href="#" class="home"><h1>Feedr</h1></a>
			  <nav>
				<section id="search">
				  <input type="text" name="name" value="" id="searchArea">
				  <div id="search-icon"><img src="images/search.png" alt="" /></div>
				</section>
				<ul>
				  <li><a href="#" class="home">News Source Home</span></a>
				  <ul>
					${state.headerItems.map((headerItem) => {
						return `<li>${renderHeaderItem(headerItem)}</li>`
					}).join('')}
				  </ul>
				  </li>
				</ul>
			  </nav>
			  <div class="clearfix"></div>
			</section>
		`
	}
	
	/*homePage render each article content*/
	function renderArticleItem(articleItem){
		return `
			 <section class="featured-image">
			  <img src="${articleItem.imageUrl}" alt="" />
			 </section>
			 <section class="article-content">
			  <a href="#"><h3 data-label="${articleItem.title}" class="clickTitle">${articleItem.title}</h3></a>
			  <h6>${articleItem.subreddit}</h6>
			 </section>
			 <section class="impressions">
			  ${articleItem.impressions}
			 </section>
			 <div class="clearfix"></div>		 
		`
	}
	
	/*homePage render content container*/
	function renderArticleList(state, into){
		into.innerHTML = `
			<section id="main" class="wrapper">
			  ${state.articleItems.map((articleItem) => {
					return `<article class="article">${renderArticleItem(articleItem)}</article>`
			  }).join('')}
			</section>
			
		`
	}

	/*loading - initial fetching stage*/
	function renderLoading(state, into){
		into.innerHTML = `
			<div id="pop-up" class="loader">
			</div>
		`
	}
	
	/*render pop up*/
	function renderPopup(state, into){
		into.innerHTML += `
			<div id="pop-up">
			<a href="#" class="close-pop-up">X</a>
			${state.articleItems.map((articleItem) => {
				if (articleItem.feedPopup){
				return `
					<div class="wrapper">
						${renderPopupItem(articleItem)}
					</div>
				`
				}
			}).join('')}
			</div>
		`
	}	
	
	/*render each pop up item*/
	function renderPopupItem(articleItem){
		return `
			<h1>${articleItem.title}</h1>
			<p>${articleItem.description}</p>
			<a href="${articleItem.url}" class="pop-up-action" target="_blank">Read more from source</a>
		`
	}	
		
	/*click function on each article title*/
	delegate("body","click","h3.clickTitle",(event) => {
		event.preventDefault();
		state.articleItems.map((articleItem) => {
			if(articleItem.feedPopup){
				articleItem.feedPopup=false;
			}
			if (event.target.getAttribute('data-label').toLowerCase()==articleItem.title.toLowerCase()){
				articleItem.feedPopup=true;
			}
		})
		renderPopup(state, container) 
	});
	
	/*close pop up*/
	delegate("body","click",".close-pop-up",(event) => {
		var popupId=document.querySelector("#pop-up")
		popupId.parentNode.removeChild(popupId);
	})	
	
	/*click function on each menu item*/
	delegate("header","click",".clickMe",(event) => {
		event.preventDefault();
		function renderClickedContainer(state, into){
			into.innerHTML = `
				<section id="main" class="wrapper">
				${state.articleItems.map((articleItem) => {
					if (event.target.getAttribute('data-label').toLowerCase()==articleItem.label.toLowerCase()){
						return `<article class="article">${renderArticleItem(articleItem)}</article>`
					}
				}).join('')}
				</section>
			`
	}
		renderClickedContainer(state, container) 
	})
	
	/*click function on the main menu*/
	delegate("header","click",".home",(event) => {
		event.preventDefault();
		renderArticleList(state, container) 
	})
	
	/*search button - search for the word*/
	delegate("header","click","#search-icon",(event) => {
		event.preventDefault();
		var seachAreaId=document.querySelector("#searchArea");
		var searchValue=seachAreaId.value.toLowerCase();
		state.articleItems.map((articleItem)=>{
			var articleTitle=articleItem.title.toLowerCase();
			if(articleItem.searchResult){
			 	articleItem.searchResult=false;
			}
			
			if(articleTitle.indexOf(searchValue)>-1){
				articleItem.searchResult=true;
			}
			if(articleTitle.indexOf(searchValue)>-1){
				state.findResult=true;
				return;
			}
		})
		
		/*render matched search content*/
		function renderSearchedContainer(state, into){
			into.innerHTML = `
				<section id="main" class="wrapper">
				  ${state.articleItems.map((articleItem) => {
						if (articleItem.searchResult){
							return `<article class="article">${renderArticleItem(articleItem)}</article>`
						}
				  }).join('')}
				</section>
			`
		}

		/*render error content when no result is found*/
		function renderNoneResultContainer(state, into){
			into.innerHTML = `
				<section id="main" class="wrapper">
							<article class="article">Hmm I can't find what you are looking for. Do you want to talk about it?</article>
					
				</section>
			`
		}

		/*render search result container*/
		if(state.findResult){
			renderSearchedContainer(state, container) 
			state.findResult = false
		}else{
			renderNoneResultContainer(state, container)
		}
		
	})

	/*trigger a click function when enter/return key is pressed*/
	document.getElementById("searchArea").addEventListener("keyup", (event) => {
	    event.preventDefault();
	    if (event.keyCode == 13) {
	    	var searchButton=document.querySelector("#search-icon");
	    	searchButton.click();
	    }
	});

	/*set search box to nothing on click*/
	delegate("header","click","#searchArea",(event) => {
		var seachAreaId=document.querySelector("#searchArea");
		if (seachAreaId.value !==''){
			seachAreaId.value = ''
		}
	})
	
})()
