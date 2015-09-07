homeApp.run(['$httpBackend', 'ServerDataModel', function($httpBackend, ServerDataModel) {
    
    $httpBackend.whenGET('/api/v0/user_details').respond(function(method, url, data) {
        var data = ServerDataModel.user_details();
        return [200, data, {}];
    });

    $httpBackend.whenGET('/api/v0/feed_news').respond(function(method, url, data) {
        var data = ServerDataModel.get_feed_news();
        return [200, data, {}];
    });

    $httpBackend.whenGET('/api/v0/get_user_score').respond(function(method, url, data) {
        var data = ServerDataModel.get_user_score();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/get_game_books\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_game_books();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/get_game_users\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_game_users();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/book_shelves\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_book_shelves();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/user_details\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.user_details();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/get_todos\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_todos();
        return [200, data, {}];
    });


    $httpBackend.whenGET(/api\/v0\/get_community_news\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_community_news();
        return [200, data, {}];
    });
    

    $httpBackend.whenGET(/api\/v0\/get_authors_interviewed\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.authors_interviewed();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/book\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_book_details();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/author_details\?.*/).respond(function(method, url, data){
        var data = ServerDataModel.get_author_details();
        return [200, data, {}];
    });    

    $httpBackend.whenGET(/api\/v0\/popular_books\?.*/).respond(function(method, url, data){
        var data = ServerDataModel.get_popular_books();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/get_bookmarks\?.*/).respond(function(method, url, data){
        var data = ServerDataModel.get_bookmarks();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/get_rooms\?.*/).respond(function(method, url, data){
        var data = ServerDataModel.get_rooms();
        return [200, data, {}];
    });

    $httpBackend.whenGET('/api/v0/suggest_communities').respond(function(method, url, data) {
        var data = ServerDataModel.get_user_communities();
        return [200, data, {}];
    });

    $httpBackend.whenGET('/api/v0/get_friends_of_friend').respond(function(method, url, data) {
        var data = ServerDataModel.get_friends_of_friend();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/basic_community_info\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_basic_community_info();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/detailed_community_info\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_detailed_community_info();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/get_community_videos\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_community_videos();
        return [200, data, {}];
    });

    $httpBackend.whenGET('/api/v0/get_communities').respond(function(method, url, data) {
        var data = ServerDataModel.get_communities();
        return [200, data, {}];
    });    

    $httpBackend.whenGET(/api\/v0\/get_communities\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_communities();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/notifications\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_notifications();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/author_basic_info\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_author_basic_info();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/feed_community_info\?.*/).respond(function(method, url, data) {
        var data = ServerDataModel.get_feed_community_info();
        return [200, data, {}];
    });

    $httpBackend.whenGET(/api\/v0\/get_social_feed\?.*/).respond(function(method, url, data){
        var data = ServerDataModel.get_social_feed();
        return [200, data, {}];
    });
    
    $httpBackend.whenGET(/html\//).passThrough();
    
}]);