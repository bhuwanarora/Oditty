homeApp.service('ServerDataModel', function ServerDataModel(){

    this.user_details = function(){
        var data = {
                    "intro_seen":null,
                    "init_book_read_count":"50-100",
                    "selectedYear":null,
                    "selectedMonth":null,
                    "selectedDay":null,
                    "first_name":"Bhuwan",
                    "last_name":"Arora",
                    "about":null,
                    "id":4986324,
                    "gender":"Male",
                    "image_url":"https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333\u0026oe=565B011E",
                    "region":null,
                    "label":["User"],
                    "latest_feed_id":5248285,
                    "follows_count":4,
                    "followed_by_count":3,
                    "bookmark_count":202,
                    "notification_count":24,
                    "facebook_books_retrieval_time":1435324689,
                    "facebook_likes_retrieval_time":null
        }
        return data;
    }

    this.get_feed_news = function(){
        var data = [
            {
                id: 5250357,
                url: "http://www.lepoint.fr/monde/attaque-par-un-requin-le-surfeur-mick-fanning-s-en-sort-indemne-19-07-2015-1949914_24.php",
                image_url: "http://www.lepoint.fr/images/commun/logos/le_point.fr.png",
                title: "Attaqué par un requin, le surfeur Mick Fanning s'en sort indemne",
                description: "VIDÉO. Le triple champion du monde de surf participait à une compétition en Afrique du Sud quand il a été attaqué par un squale. La scène a été filmée.",
                created_at: 1437364569,
                label: [
                    "News"
                ],
                bookmark_count: 0,
                view_count: 0,
                follow_count: 0,
                communities: [
                    {
                        view_count: null,
                        name: "Mick Fanning",
                        id: 5250358,
                        image_url: "http://www.azquotes.com/public/pictures/authors/bb/0a/bb0a662e54d380718065244383cd5bec/5476903d93348_mick_fanning.jpg"
                    }
                ],
                users: [
                    {
                        first_name: null,
                        last_name: null,
                        id: null,
                        image_url: null
                    }
                ]
            },
            {
                id: 5250359,
                url: "http://www.ouest-france.fr/argentine-video-un-magnifique-en-coup-du-foulard-3572044",
                image_url: "http://www.ouest-france.fr/sites/default/files/styles/image-900x500/public/2015/07/19/video.le-magnifique-en-coup-du-foulard.jpg?itok=Wy6pwhw-",
                title: "Football. VIDEO. Un magnifique but en coup du foulard",
                description: "En Argentine, Carlos Tevez faisait son grand retour dans le stade du Boca Junior. Mais hier, c'est l'attaquant Jonathan Calleri qui a marqué les esprits avec un",
                created_at: 1437364615,
                label: [
                    "News"
                ],
                bookmark_count: 0,
                view_count: 0,
                follow_count: 0,
                communities: [
                    {
                        view_count: null,
                        name: "Carlos Tevez",
                        id: 5250360,
                        image_url: "http://i.telegraph.co.uk/multimedia/archive/02619/carlos-tevez_2619963b.jpg"
                    }
                ],
                users: [
                    {
                        first_name: null,
                        last_name: null,
                        id: null,
                        image_url: null
                    }
                ]
            },
            {
                id: 5250361,
                url: "http://www.ghanaweb.com/GhanaHomePage/NewsArchive/Why-I-refused-to-give-school-headmistress-chalk-369537",
                image_url: "http://cdn.ghanaweb.com/imagelib/pics/30696810.jpg",
                title: "Why I refused to give school headmistress chalk – Veep’s wife",
                description: "The Second Lady, Mrs Matilda Amissah-Arthur, has opened up on what led...",
                created_at: 1437364672,
                label: [
                    "News"
                ],
                bookmark_count: 0,
                view_count: 0,
                follow_count: 0,
                communities: [
                    {
                        view_count: null,
                        name: "Kukurantumi",
                        id: 5250365,
                        image_url: "http://www.forafricalibrary.org/images/2011/May_2011_068_med.jpg"
                    }
                ],
                users: [
                    {
                        first_name: null,
                        last_name: null,
                        id: null,
                        image_url: null
                    }
                ]
            },
            {
                id: 5250355,
                url: "http://www.eurosport.fr/cyclisme/tour-de-france/2015/froome-en-remet-une-couche-sur-jalabert_sto4827106/story.shtml",
                image_url: "http://i.eurosport.com/2015/07/19/1643836-34874614-1600-900.jpg",
                title: "Froome en remet une couche sur Jalabert",
                description: "TOUR DE FRANCE - Plutôt apaisé à l'arrivée de l'étape de dimanche, Chris Froome est remonté dans les tours en soirée. Par deux tweets adressés à Laurent Jalabert. Ce dernier, interrogé par la télévision anglaise, a nié avoir dit que la démonstration de force de l'Anglais frôlait le \"ridicule\".",
                created_at: 1437364554,
                label: [
                    "News"
                ],
                bookmark_count: 0,
                view_count: 0,
                follow_count: 0,
                communities: [
                    {
                        view_count: null,
                        name: "Laurent Jalabert",
                        id: 5250356,
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Laurent_JALABERT.jpg/220px-Laurent_JALABERT.jpg"
                    }
                ],
                users: [
                    {
                        first_name: null,
                        last_name: null,
                        id: null,
                        image_url: null
                    }
                ]
            }
        ];
        return data;
    }

    this.get_feed_community_info = function(){
        var data = {
            view_count: 0,
            name: "Minister Alexis Tsipras",
            id: 5057097,
            image_url: "https://timedotcom.files.wordpress.com/2015/01/alexis-tsipras3.jpg?quality=65&strip=color&w=1100",
            label: [
                "Community",
                "SuperCommunity"
            ],
            follow_count: 1,
            facebook_url: null,
            twitter_url: null,
            wiki_url: "https://en.wikipedia.org/wiki/Alexis_Tsipras"
        }
        return data;
    }

    this.get_author_basic_info = function(){
        var data = {
            name: "Salman Khurshid",
            id: 4975556,
            wiki_url: "http://en.wikipedia.org/wiki/Salman_Khurshid",
            overview: "Salman Khurshid has been deeply involved in writing and acting in plays since his student days in Delhi and Oxford. He is the author of the play Sons of Babur, published by Rupa & Co., which has been staged, with Tom Alter in the lead role, at the Red Fort in Delhi. He has also been the editor of \"The Contemporary Conservative: Selected Writings of Dhiren Bhagat\" published in 1990.",
            label: [
                "Author",
                "Active"
            ],
            location: "Aligarh, Uttar Pradesh, India",
            books_count: null,
            is_interviewed: true
        }
        return data;
    }

    this.get_notifications = function(){
        var data = [
            {
                created_at: 1437137889,
                user: {
                    id: 4986324,
                    name: null
                },
                node: {
                    key: null,
                    content: null,
                    wrapper_content: null
                },
                author: {
                    id: 4975556
                },
                label: "FollowsNode"
            },
            {
                created_at: 1436681578,
                user: {
                    id: 4986324,
                    name: null
                },
                node: {
                    key: null,
                    content: null,
                    wrapper_content: null
                },
                community: {
                    id: 5057097
                },
                label: "FollowsNode"
            },
            {
                created_at: 1436628756,
                user: {
                    id: 4986324,
                    name: null
                },
                node: {
                    key: null,
                    content: null,
                    wrapper_content: null
                },
                friend: {
                    id: 4940654
                },
                label: "FollowsNode"
            },
            {
                created_at: 1436555388,
                user: {
                    id: 4986324,
                    name: null
                },
                node: {
                    key: null,
                    content: null,
                    wrapper_content: null
                },
                friend: {
                    id: 4947922
                },
                label: "FollowsNode"
            }
        ]
        return data;
    }

    this.get_communities = function(){
        var data = [
            {
                view_count: 0,
                name: "Minister Alexis Tsipras",
                id: 5057097,
                image_url: "https://timedotcom.files.wordpress.com/2015/01/alexis-tsipras3.jpg?quality=65&strip=color&w=1100",
                label: [
                "Community",
                "SuperCommunity"
                ],
                follow_count: 1,
                facebook_url: null,
                twitter_url: null,
                wiki_url: "https://en.wikipedia.org/wiki/Alexis_Tsipras"
            },
            {
                view_count: 8,
                name: "Pluto's moons",
                id: 4977757,
                image_url: "http://solarsystem.nasa.gov/images/Pluto-System(New-Names).jpg",
                label: [
                "Location",
                "Community"
                ],
                follow_count: 2,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Moons_of_Pluto"
            },
            {
                view_count: 117,
                name: "Mars exploration",
                id: 4976760,
                image_url: "http://upload.wikimedia.org/wikipedia/commons/d/d8/NASA_Mars_Rover.jpg",
                label: [
                "Community"
                ],
                follow_count: 15,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Mars_Exploration_Program"
            },
            {
                view_count: 178,
                name: "India",
                id: 5021643,
                image_url: "http://www.telegraph.co.uk/incoming/article115830.ece/ALTERNATES/w620/india.jpg",
                label: [
                "Community",
                "SuperCommunity"
                ],
                follow_count: 3,
                facebook_url: null,
                twitter_url: null,
                wiki_url: "https://en.wikipedia.org/wiki/India"
            }
        ];
        return data;
    }

    this.get_community_videos = function(){
        var data = [
            {
                title: "Biggest Fight in Cricket History Ever- India Vs Australia. Thank you for watching this video and ...",
                url: "http://www.youtube.com/watch?v=WCNEWDoOY3E",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/WCNEWDoOY3E/default.jpg?h=90&w=120&sigh=__DtDJKRvpIvEZDHhUJ6LkYzaPbE4=",
                duration: 291,
                published_date: 1400831199
            },
            {
                title: "INDIA Vs AUS T20 - Unforgettable Boundaries of Yuvraj Singh (BCO CRICKET)",
                url: "http://www.youtube.com/watch?v=KWFTdIiSYHA",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/KWFTdIiSYHA/default.jpg?h=90&w=120&sigh=__PxP9y9X5aALDotqgA7-1NfW6SVA=",
                duration: 601,
                published_date: 1417813817
            },
            {
                title: "India Vs Pakistan CRICKET FIGHTS ... Pakistan har match mein India ke samne apni ...",
                url: "http://www.youtube.com/watch?v=vj3FKJ9PTxI",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/vj3FKJ9PTxI/default.jpg?h=90&w=120&sigh=__8VYLw2ErGPacoJgIOvIKIJ2jpsE=",
                duration: 273,
                published_date: 1372931776
            },
            {
                title: "Indian Cricket Dressing Room Comedy ... fuck Indian cricket team. .... India Cricket Team ...",
                url: "http://www.youtube.com/watch?v=1_tQAAi75Dg",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/1_tQAAi75Dg/default.jpg?h=90&w=120&sigh=__vszZv1xIdPM_tD0G8rRkTl_l4Bs=",
                duration: 96,
                published_date: 1396982908
            },
            {
                title: "Unforgettable Fights of Cricket | India Vs Pakistan (2014). Thank you for watching this video ...",
                url: "http://www.youtube.com/watch?v=SG38n5WY5Wk",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/SG38n5WY5Wk/default.jpg?h=90&w=120&sigh=__eIMrK8dOVZ8cFp0eECU4pETyzXA=",
                duration: 109,
                published_date: 1412601404
            },
            {
                title: "AUS Vs INDIA T20 - Unbelievable Wicket of Australia Player (BCO CRICKET)",
                url: "http://www.youtube.com/watch?v=-SqAFVnbCUA",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/-SqAFVnbCUA/default.jpg?h=90&w=120&sigh=__uiKouZpmMNP7xNItiZiZCAtTd1o=",
                duration: 601,
                published_date: 1417814811
            },
            {
                title: "Watch full match highlights - http://www.youtube.com/watch?v=Oaz5RzvUYA8 India batting ...",
                url: "http://www.youtube.com/watch?v=k7Qau8gS1JE",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/k7Qau8gS1JE/default.jpg?h=90&w=120&sigh=__G_XZuS2ahaaik-peJGOoXG7W6uY=",
                duration: 424,
                published_date: 1390654085
            },
            {
                title: "India VS Pakistan Six Biggest fights of Cricket . ... In cricket there are always fights between ...",
                url: "http://www.youtube.com/watch?v=fCYAb5Dvn2g",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/fCYAb5Dvn2g/default.jpg?h=90&w=120&sigh=__AH3stYQ_uTjTvPcj1CnCmI-1v7U=",
                duration: 167,
                published_date: 1390571076
            },
            {
                title: "Most Horrible Cricket Fights Of INDIA vs PAKISTAN : ICC World Cup. Cricket Leagues ... no ...",
                url: "http://www.youtube.com/watch?v=jHLKnUUTL4M",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/jHLKnUUTL4M/default.jpg?h=90&w=120&sigh=__wPcSqpn_giy7ekyXdAsji8eP2Ew=",
                duration: 196,
                published_date: 1413191759
            },
            {
                title: "Subscribe and also watch : Kevin Pietersen Blindfold Cricket Most Runs in 1 Over in ... Imagine ...",
                url: "http://www.youtube.com/watch?v=RPvIFuXSrtk",
                publisher: "youtube.com",
                thumbnail: "https://img.youtube.com/vi/RPvIFuXSrtk/default.jpg?h=90&w=120&sigh=__ENaGyMs_aSP9Hc-08Uu-6aZEdQk=",
                duration: 283,
                published_date: 1352999159
            }
        ];
        return data;
    }

    this.get_friends_of_friend = function(){
        var data = [
            {
                intro_seen: null,
                init_book_read_count: "50-100",
                selectedYear: 1993,
                selectedMonth: "Jul",
                selectedDay: 25,
                first_name: "Prachi ",
                last_name: "Jain",
                about: null,
                id: 4105710,
                gender: "Female",
                image_url: "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xaf1/v/t1.0-9/10897772_592790384153919_434528103823779598_n.jpg?oh=e552b8140b051ee4b853cf196b67230a&oe=560864EA&__gda__=1442406036_ba26d0f76a210a5603bcb06eba56a8a3",
                region: null,
                label: [
                    "User"
                ],
                latest_feed_id: 5248938,
                follows_count: 3,
                followed_by_count: 1,
                bookmark_count: 526,
                notification_count: 6,
                facebook_books_retrieval_time: 1436165411,
                facebook_likes_retrieval_time: null
            },
            {
                intro_seen: null,
                init_book_read_count: null,
                selectedYear: null,
                selectedMonth: null,
                selectedDay: null,
                first_name: "Niraj ",
                last_name: "Singh",
                about: null,
                id: 4960099,
                gender: null,
                image_url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/10387625_10154830080125246_7202132996183545930_n.jpg?oh=d71ec072d4e78ced707975eaf11a1d50&oe=55CB553B&__gda__=1443167050_0cb9e95c2d598e860fbc6c6ef39759eb",
                region: null,
                label: [
                    "User"
                ],
                latest_feed_id: null,
                follows_count: 0,
                followed_by_count: 3,
                bookmark_count: 9,
                notification_count: 3,
                facebook_books_retrieval_time: 1436465685,
                facebook_likes_retrieval_time: null
            },
            {
                intro_seen: null,
                init_book_read_count: null,
                selectedYear: null,
                selectedMonth: null,
                selectedDay: null,
                first_name: null,
                last_name: null,
                about: null,
                id: 4974412,
                gender: null,
                image_url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/p200x200/422882_100654006757750_1217060602_n.jpg?oh=3ad5e7bf5dc511f4d66b1493614febe5&oe=56100312&__gda__=1448371743_b032efe48d3bbbaae7ecabb2412e8640",
                region: null,
                label: [
                    "User"
                ],
                latest_feed_id: 5249739,
                follows_count: 4,
                followed_by_count: 0,
                bookmark_count: 135,
                notification_count: 12,
                facebook_books_retrieval_time: null,
                facebook_likes_retrieval_time: null
            },
            {
                intro_seen: null,
                init_book_read_count: null,
                selectedYear: null,
                selectedMonth: null,
                selectedDay: null,
                first_name: "Ashesh",
                last_name: "Mishra",
                about: null,
                id: 4984918,
                gender: null,
                image_url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041",
                region: null,
                label: [
                    "User"
                ],
                latest_feed_id: 5135898,
                follows_count: 1,
                followed_by_count: 0,
                bookmark_count: 39,
                notification_count: 21,
                facebook_books_retrieval_time: null,
                facebook_likes_retrieval_time: null
            },
            {
                intro_seen: null,
                init_book_read_count: null,
                selectedYear: null,
                selectedMonth: null,
                selectedDay: null,
                first_name: "Harsh ",
                last_name: "Snehanshu",
                about: null,
                id: 4981192,
                gender: null,
                image_url: "https://scontent-hkg3-1.xx.fbcdn.net/hphotos-xap1/v/t1.0-9/11295605_10153148232769300_7738032208029170590_n.jpg?oh=5ed0877e45790ab9a3c6bd2e5c5ce77a&oe=560C4D5E",
                region: null,
                label: [
                    "User"
                ],
                latest_feed_id: null,
                follows_count: 0,
                followed_by_count: 1,
                bookmark_count: 0,
                notification_count: 1,
                facebook_books_retrieval_time: null,
                facebook_likes_retrieval_time: null
            }
        ];
        return data;
    }

    this.get_detailed_community_info = function(){
        var data = [
            {
                most_important_tag: [
                    {
                        image_url: "https://6ssatnist.files.wordpress.com/2011/04/ind-vs-sl.jpg",
                        name: "Cricket in India",
                        view_count: 34,
                        users: [
                            {
                                first_name: "Ashesh ",
                                image_url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041",
                                selectedMonth: null,
                                id: 4974698,
                                last_name: "Mishra ",
                                init_book_read_count: null,
                                about: null,
                                selectedYear: null,
                                selectedDay: null,
                                gender: null
                            }
                        ],
                        id: 5023879,
                        books: [
                            {
                                popularity: 1576,
                                published_year: null,
                                page_count: "232",
                                author_name: "Ed Hawkins",
                                id: 1938599,
                                isbn: null,
                                title: "Bookie Gambler Fixer Spy"
                            }
                        ]
                    }
                ]
            }
        ];
        return data;
    }

    this.get_basic_community_info = function(){
        var data = [
            {
                most_important_tag: [
                    {
                        image_url: "https://6ssatnist.files.wordpress.com/2011/04/ind-vs-sl.jpg",
                        name: "Cricket in India",
                        view_count: 34,
                        users: [
                            {
                                first_name: "Ashesh ",
                                image_url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041",
                                selectedMonth: null,
                                id: 4974698,
                                last_name: "Mishra ",
                                init_book_read_count: null,
                                about: null,
                                selectedYear: null,
                                selectedDay: null,
                                gender: null
                            }
                        ],
                        id: 5023879,
                        books: [
                            {
                                popularity: 1576,
                                published_year: null,
                                page_count: "232",
                                author_name: "Ed Hawkins",
                                id: 1938599,
                                isbn: null,
                                title: "Bookie Gambler Fixer Spy"
                            }
                        ]
                    }
                ]
            }
        ];
        return data;
    }

    this.get_user_communities = function(){
        var data = [
            {
                view_count: 34,
                name: "Cricket in India",
                id: 5023879,
                image_url: "https://6ssatnist.files.wordpress.com/2011/04/ind-vs-sl.jpg",
                label: [
                    "Community",
                    "SuperCommunity"
                ],
                follow_count: 1,
                facebook_url: null,
                twitter_url: null,
                wiki_url: "https://en.wikipedia.org/wiki/Cricket_in_India"
            },
            {
                view_count: 28,
                name: "World economy",
                id: 5006092,
                image_url: "http://cdn5.freedomoutpost.com/wp-content/uploads/2013/10/business-news_05_temp-1334821725-4f8fc35d-620x348.jpg",
                label: [
                    "Community"
                ],
                follow_count: 0,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/World_economy"
            },
            {
                view_count: 10,
                name: "Haaretz",
                id: 5022896,
                image_url: "http://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Newspapers.jpg/250px-Newspapers.jpg",
                label: [
                    "Community",
                    "SuperCommunity"
                ],
                follow_count: 0,
                facebook_url: "https://www.facebook.com/haaretzcom",
                twitter_url: "https://twitter.com/haaretzcom?lang=en",
                wiki_url: "https://en.wikipedia.org/wiki/Haaretz"
            },
            {
                view_count: 8,
                name: "Wisden Cricketers of the Year",
                id: 4975728,
                image_url: "http://specials.rediff.com/cricket/2003/oct/30cric2.jpg",
                label: [
                    "Community"
                ],
                follow_count: 0,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Wisden_Cricketers_of_the_Year"
            },
            {
                view_count: 5,
                name: "Scouting in the Philippines",
                id: 4975794,
                image_url: "http://www.wagggs.org/shared/uploads/organisations/images/thumb_Philippines.JPG.PNG",
                label: [
                    "Location",
                    "Community"
                ],
                follow_count: 0,
                facebook_url: "https://www.facebook.com/scoutsphilippines",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Boy_Scouts_of_the_Philippines"
            },
            {
                view_count: 4,
                name: "Macroeconomics",
                id: 4978331,
                image_url: "http://cw.routledge.com/textbooks/rossana/images/title.jpg",
                label: [
                    "Community"
                ],
                follow_count: 1,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Macroeconomics"
            },
            {
                view_count: 4,
                name: "Territorial disputes of China",
                id: 4982924,
                image_url: "http://static01.nyt.com/images/2012/09/25/timestopics/Chinas-Territorial-Disputes/Chinas-Territorial-Disputes-sfSpan-v2.jpg",
                label: [
                "Location",
                "Community"
                ],
                follow_count: 0,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Category:Territorial_disputes_of_China"
            },
            {
                view_count: 3,
                name: "Australian National Heritage List",
                id: 4976132,
                image_url: "http://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Australian_Academy_of_Science_-_The_Shine_Dome.jpg/150px-Australian_Academy_of_Science_-_The_Shine_Dome.jpg",
                label: [
                "Community"
                ],
                follow_count: 0,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Australian_National_Heritage_List"
            },
            {
                view_count: 3,
                name: "Team sports",
                id: 4977692,
                image_url: "http://www.schoolatoz.nsw.edu.au/detresources/iStock_000011846803Small_ikgKGYcAPC_l.png",
                label: [
                "Community"
                ],
                follow_count: 0,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Team_sport"
            },
            {
                view_count: 3,
                name: "Schools of medicine in India",
                id: 4999502,
                image_url: "http://upload.wikimedia.org/wikipedia/commons/6/6a/John_Morgan_Building_of_the_Perelman_School_of_Medicine.jpg",
                label: [
                    "Location",
                    "Community"
                ],
                follow_count: 0,
                facebook_url: "",
                twitter_url: "",
                wiki_url: "https://en.wikipedia.org/wiki/Category:Schools_of_medicine_in_India"
            }
        ];

        return data;
    }    
});