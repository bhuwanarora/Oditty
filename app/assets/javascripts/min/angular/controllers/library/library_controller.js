homeApp.controller("libraryController",["$scope","$rootScope","$timeout","WebsiteUIConstants","SearchUIConstants","bookService","$routeParams","$location","ColorConstants","$mdToast","infinityService","$mdBottomSheet","$mdSidenav","sharedService",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){a.get_popular_books=function(){Object.keys(b.filters).length>0?n.filtered_books(a):n.get_popular_books(a)},a.init_book=function(b){var c=a.info.books[b];f.get_basic_details(c).then(function(c){a.info.books[b]=angular.extend(a.info.books[b],c)})},a.ungroup=function(){a.info.author_filter=!1,a.info.group_by_alphabet=!1,a.info.reading_time_filter=!1,a.info.published_era_filter=!1,a.info.subject_filter=!1},a.group_by_author=function(){a.info.author_filter=!0,a.info.group_by_alphabet=!1,a.info.reading_time_filter=!1,a.info.published_era_filter=!1,a.info.subject_filter=!1},a.group_by_alphabet=function(){a.info.author_filter=!1,a.info.group_by_alphabet=!0,a.info.reading_time_filter=!1,a.info.published_era_filter=!1,a.info.subject_filter=!1},a.group_by_reading_time=function(){a.info.author_filter=!1,a.info.group_by_alphabet=!1,a.info.reading_time_filter=!0,a.info.published_era_filter=!1,a.info.subject_filter=!1},a.group_by_published_era=function(){a.info.author_filter=!1,a.info.group_by_alphabet=!1,a.info.reading_time_filter=!1,a.info.published_era_filter=!0,a.info.subject_filter=!1},a.group_by_subject=function(){a.info.author_filter=!1,a.info.group_by_alphabet=!1,a.info.reading_time_filter=!1,a.info.published_era_filter=!1,a.info.subject_filter=!0},a.select_read_time=function(){delete a.info.books,a.info.custom_loading=!0},a.select_genre=function(b){delete a.info.books,a.info.custom_loading=!0,a.filters.other=angular.extend(a.filters.other,{genre:b.id}),a._get_popular_books()},a.select_author=function(){delete a.info.books,a.info.custom_loading=!0},a.select_time_group=function(){delete a.info.books,a.info.custom_loading=!0},a._get_popular_books=function(){n.load_popular_books(a)},a.show_grid=function(){a.constant.show_book&&(a.grid_style={height:"initial","padding-bottom":"100px"},a.constant={show_book:!1})},a.show_book=function(c,d){a.grid_style={height:"35px","overflow-y":"hidden","padding-bottom":"0px"},a.constant={show_book:!0},b.active_book=d,c.stopPropagation()},a.toggle_infinity_content=function(){a.info.loading=!0,angular.isDefined(a.info.infinity)&&a.info.infinity?a._get_personalised_suggestions():a._get_popular_books()},a._get_personalised_suggestions=function(){var b=function(a,b){angular.forEach(a,function(a){var b=Math.floor(Math.random()*i.value.length),c={colspan:1,color:i.value[b],rowspan:1};a=angular.extend(a,c),this.push(a)},b)},d=c(function(){k.get_small_reads().then(function(c){a.small_reads=[],b(c,a.small_reads)})},100),e=c(function(){k.get_books_from_favourite_author().then(function(c){c=c[0],a.books_from_favourite_author=[],b(c.books,a.books_from_favourite_author),delete c.books,a.likeable_author=c})},100),f=c(function(){k.get_books_from_favourite_category().then(function(c){a.books_from_favourite_category=[],b(c.books,a.books_from_favourite_category),a.likeable_category=c.info})},100),g=c(function(){k.get_books_from_favourite_era().then(function(c){c=c[0],a.books_from_favourite_era=[],b(c.books,a.books_from_favourite_era),a.likeable_era=c.info})},100),h=c(function(){k.get_books_on_friends_shelves().then(function(c){a.friends=c,angular.forEach(a.friends,function(a){b(a.books,a.books)})})},100),j=c(function(){k.get_books_from_unexplored_subjects().then(function(b){a.books_from_unexplored_subjects=b.books,a.unexplored_subject=b.info,a.info.loading=!1})},100);a.$on("destroy",function(){c.cancel(d),c.cancel(e),c.cancel(f),c.cancel(g),c.cancel(h),c.cancel(j)})};!function(){a.$routeParams=g,a.filters={other:{}},a.grid={},a.active_endorse=!1,a.active_bookmark=!0,a.active_share=!0,a._get_personalised_suggestions(),a.constant={show_book:!1},a.info.books=[],a.search_tag={},a.active_tab={},a.info.categories=[],a.info.loading=!0}();a.show_right_nav=function(a){m("alphabets_sidenav").toggle(),a.stopPropagation()},a.show_left_nav=function(a){m("sort_by_sidenav").toggle(),a.stopPropagation()},a.show_bottom_filters=function(b){l.show({templateUrl:"/assets/angular/html/library/bottom_sheet_filters.html",targetEvent:b,scope:a,preserveScope:!0,controller:"filtersController"})}}]);