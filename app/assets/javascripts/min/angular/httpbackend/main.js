homeApp.run(["$httpBackend","ServerDataModel",function(a,b){a.whenGET("/api/v0/user_details").respond(function(a,c,d){var d=b.user_details();return[200,d,{}]}),a.whenGET("/api/v0/feed_news").respond(function(a,c,d){var d=b.get_feed_news();return[200,d,{}]}),a.whenGET(/api\/v0\/user_details\?.*/).respond(function(a,c,d){var d=b.user_details();return[200,d,{}]}),a.whenGET(/api\/v0\/popular_books\?.*/).respond(function(a,c,d){var d=b.get_popular_books();return[200,d,{}]}),a.whenGET(/api\/v0\/get_bookmarks\?.*/).respond(function(a,c,d){var d=b.get_bookmarks();return[200,d,{}]}),a.whenGET(/api\/v0\/get_rooms\?.*/).respond(function(a,c,d){var d=b.get_rooms();return[200,d,{}]}),a.whenGET("/api/v0/suggest_communities").respond(function(a,c,d){var d=b.get_user_communities();return[200,d,{}]}),a.whenGET("/api/v0/get_friends_of_friend").respond(function(a,c,d){var d=b.get_friends_of_friend();return[200,d,{}]}),a.whenGET(/api\/v0\/basic_community_info\?.*/).respond(function(a,c,d){var d=b.get_basic_community_info();return[200,d,{}]}),a.whenGET(/api\/v0\/detailed_community_info\?.*/).respond(function(a,c,d){var d=b.get_detailed_community_info();return[200,d,{}]}),a.whenGET(/api\/v0\/get_community_videos\?.*/).respond(function(a,c,d){var d=b.get_community_videos();return[200,d,{}]}),a.whenGET("/api/v0/get_communities").respond(function(a,c,d){var d=b.get_communities();return[200,d,{}]}),a.whenGET(/api\/v0\/get_communities\?.*/).respond(function(a,c,d){var d=b.get_communities();return[200,d,{}]}),a.whenGET(/api\/v0\/notifications\?.*/).respond(function(a,c,d){var d=b.get_notifications();return[200,d,{}]}),a.whenGET(/api\/v0\/author_basic_info\?.*/).respond(function(a,c,d){var d=b.get_author_basic_info();return[200,d,{}]}),a.whenGET(/api\/v0\/feed_community_info\?.*/).respond(function(a,c,d){var d=b.get_feed_community_info();return[200,d,{}]}),a.whenGET(/api\/v0\/get_social_feed\?.*/).respond(function(a,c,d){var d=b.get_social_feed();return[200,d,{}]}),a.whenGET(/html\//).passThrough()}]);