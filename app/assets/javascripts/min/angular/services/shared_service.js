homeApp.service("sharedService",["$timeout","$rootScope","ColorConstants","$location","bookService","shelfService","$mdToast","infinityService","userService","$location","newsService","Years","Months",function(a,b,c,d,e,f,g,h,i,d,j,k,l){this.get_popular_books=function(a,b){var c=!(a.info.loading||!angular.isUndefined(a.constant)&&a.constant.show_book||!angular.isUndefined(a.info.author_filter)&&a.info.author_filter||!angular.isUndefined(a.info.group_by_alphabet)&&a.info.group_by_alphabet||a.info.reading_time_filter||a.info.published_era_filter||a.info.custom_loading||a.info.subject_filter||!(a.info.infinity||angular.isUndefined(a.info.infinity)||angular.isDefined(b)));c&&this.load_popular_books(a,b)};var m=function(a){if(null==a.page_count)var b="Dont Know";else if(a.page_count=parseInt(a.page_count),a.page_count<50)var b="For a flight journey";else if(a.page_count<100)var b="For a weekend getaway";else if(a.page_count<=250)var b="For a week holiday";else if(a.page_count>250)var b="For a month vacation";else var b="Dont Know";return b},n=function(a){if(a.published_year>2e3)var b="Contemporary";else if(a.published_year>=1939&&a.published_year<2e3)var b="Post Modern Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Modernism";else if(a.published_year>=1837&&a.published_year<1901)var b="Victorian Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Romanticism";else if(a.published_year>=1798&&a.published_year<1837)var b="Neo Classical Period";else if(a.published_year>=1900&&a.published_year<1939)var b="English Renaissance";else if(a.published_year>=1660&&a.published_year<1798)var b="Middle English Literature";else if(a.published_year>=1900&&a.published_year<1939)var b="Old English Literature";else var b="Don't Know";return b};this.show_book_dialog=function(a,b,c,d){var e=c.book_id||c.id;window.location.href="/book?id="+e},this.filtered_books=function(a){a.info.loading=!0,a.info.fetching_books=!0;var b=a.info.books.length;h.get_books(b).then(function(b){null!=b&&(angular.forEach(b.books,function(a){var b=null!=a.status,c=m(a),d=n(a);if(null!=a.title){var e=a.title[0],f={published_era:d,reading_time:c,status:b,isBook:!0,colspan:1,rowspan:1,alphabet:e};f=angular.extend(a,f),this.push(f)}},a.info.books),delete b.books,a.info.other_info=b),a.info.fetching_books=!1,a.info.loading=!1})},this.toggle_bookmark=function(a,b,c,d){var e=function(){var a=getCookie("todo");a&&(a=JSON.parse(a),a.filters.shelf||(deleteCookie("todo"),i.update_todo_key("filters/shelf")))};if(e(),angular.isUndefined(d.info)&&(d.info={loading:!1}),!d.info.loading){d.info.loading=!0;var h={bottom:!1,top:!0,left:!1,right:!0},j=function(){return Object.keys(h).filter(function(a){return h[a]}).join(" ")};if(angular.isUndefined(b)||!b)var k=!0;else var k=!1;var l=c.id,m=c.type,n=a.label_key||a.key,o={id:l,type:m,shelf:n,status:k};f.bookmark(o).then(function(){d.info.loading=!1,g.show({controller:"toastController",templateUrl:"assets/angular/html/shared/toast/bookmark_action.html",hideDelay:3e3,position:j()})})}},this.get_community_news=function(a){var b="/room/books"!=d.path()&&"/room/videos"!=d.path()&&"/room/wiki"!=d.path(),c=a.active_tag.id;if(angular.isUndefined(a.active_tag.news)&&(a.active_tag.news=[]),b){var e=a.active_tag.news.length,f=l.indexOf(a.info.active_month);if(!a.info.loading){a.info.loading=!0;var g=a.info.active_time;if("recent"==g&&(g=2015),angular.isUndefined(a.info.active_month))var g=g+"/12";else var g=g+"/"+(12-f+1);j.get_community_news(c,e,g).then(function(b){if(null!=b&&b.length>0)b=b[0],a.active_tag.news=a.active_tag.news.concat(b.news);else if(11==f){if("1998"!=g){var c=k.indexOf(g);g=k[c+1],a.info.active_month=l[0]}}else a.info.active_month=l[f+1];a.info.loading=!1})}}},this.load_popular_books=function(a,b){a.info.loading=!0,angular.isUndefined(b)&&(angular.isUndefined(a.info.books)&&(a.info.books=[]),b=a.info.books);var c=b.length;angular.isUndefined(a.filters)&&(a.filters={});var d=angular.extend(a.filters,{skip_count:c});d=angular.toJson(d);var f=function(b){var c=!1;return angular.forEach(a.info.categories,function(a){angular.equals(a,b)&&(c=!0)}),!c};e.get_popular_books(d).then(function(c){angular.forEach(c,function(b){angular.isDefined(a.info.categories)&&angular.forEach(b.root_category,function(b){0==a.info.categories.length?null!=b.name&&a.info.categories.push(b):angular.forEach(a.info.categories,function(a){!angular.equals(b,a)&&f(b)&&null!=b.name&&this.push(b)},a.info.categories)});var c=null!=b.status,d=m(b),e=n(b),g={published_era:e,reading_time:d,status:c,isBook:!0,colspan:1,rowspan:1,alphabet:b.title[0],root_category:b.root_category};g=angular.extend(b,g),this.push(g)},b),a.info.loading=!1})}}]);