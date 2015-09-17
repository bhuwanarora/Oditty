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
                    "facebook_likes_retrieval_time":null,
                    "invite_count":1
        }
        return data;
    }

    this.room_suggestions = function(){
        var data = [
            {
                "name" : "Social Psychology",
                "id": 4998086,
                "score": 3,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Comic Book Superhero",
                "id": 5017968,
                "score": 2,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Political Philosophy",
                "id": 4972796,
                "score": 3,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Sports",
                "id": 5024590,
                "score": 1,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Brain",
                "id": 4988942,
                "score": 2,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Religion",
                "id": 5023062,
                "score": 3,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Technology",
                "id": 5021552,
                "score": 1,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Health",
                "id": 5020478,
                "score": 3,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Blanching(Cooking)",
                "id": 5107299,
                "score": 2,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            },
            {
                "name" : "Kumaon Literary Festival",
                "id": 5408842,
                "score": 2,
                "facebook_likes": [
                    {
                        "name" : "Social Psychology",
                        "id": 4998086
                    },
                    {
                        "name" : "Comic Book Superhero",
                        "id": 5017968
                    }
                ]
            }
        ];

        return data;
    }

    this.get_community_news = function(){
        var data = [
                {
                news: [
                {
                    image_url: "http://s1.firstpost.in/wp-content/uploads/2015/08/Gomis-vs-United-Getty.jpg",
                    view_count: 0,
                    description: "Swansea City came from behind to end Manchester United's unbeaten start to the Premier League season with an impressive 2-1 victory at the Liberty Stadium on Sunday.",
                    news_id: 5787117,
                    news_url: "http://www.firstpost.com/sports/epl-surprising-swansea-shock-manchester-united-again-2414210.html",
                    bookmark_count: 0,
                    created_at: 1441074917,
                    title: "EPL: Surprising Swansea shock Manchester United again - Firstpost"
                },
                {
                    image_url: "http://manilastandardtoday.com/panel/_files/modbuild/wp-images/wp-content/uploads/2015/08/cc160__jimeno-300x300.jpg",
                    view_count: 0,
                    description: "For 117 years now, the Philippines has been independent of foreign subjugation, thanks to the self-sacrifice, bravery and heroism of our heroes.",
                    news_id: 5785799,
                    news_url: "http://manilastandardtoday.com/2015/08/31/wanted-new-heroes/",
                    bookmark_count: 0,
                    created_at: 1441064120,
                    title: "Wanted: new heroes - The Standard"
                },
                {
                    image_url: "http://e1.365dm.com/15/08/150x150/jose-mourinho-chelsea-manchester-city-premier-league_3340488.jpg",
                    view_count: 0,
                    description: "Jose Mourinho said he is as motivated as ever to win the Premier League and has called on his Chelsea players to re-discover their fire after a dismal start to the campaign.",
                    news_id: 5784722,
                    news_url: "http://www.skysports.com/football/news/11668/9973251/mourinho-burning-for-trophies",
                    bookmark_count: 0,
                    created_at: 1441062064,
                    title: "Jose Mourinho says his desire to win the title with Chelsea burns deep"
                },
                {
                    image_url: "http://media.therakyatpost.com/wp-content/uploads/2015/08/plug-L.jpg",
                    view_count: 0,
                    description: "DETROIT, Aug 31, 2015: A Nasa-sponsored research produced a liquid compound that hardens in a matter of seconds after contacting air, reported Russian news portal RT. The  liquid compound can be used to create self-sealing walls on aircraft, making punctures a less-threatening threat in space. RT reports that the resin must be put between a polymer …",
                    news_id: 5782910,
                    news_url: "http://www.therakyatpost.com/world/2015/08/31/scientists-create-self-healing-material-that-can-plug-holes-in-spaceships/",
                    bookmark_count: 0,
                    created_at: 1441050304,
                    title: "Scientists create self-healing material that can plug holes in spaceships - The Rakyat Post"
                },
                {
                    image_url: "http://e0.365dm.com/15/08/150x150/andre-ayew-goal_3344179.jpg",
                    view_count: 0,
                    description: "We pick out the key talking points from Swansea's 2-1 win over Manchester United at the Liberty Stadium. ",
                    news_id: 5782446,
                    news_url: "http://www.skysports.com/football/news/11667/9972976/swansea-2-1-manchester-united-talking-points-from-liberty-stadium",
                    bookmark_count: 0,
                    created_at: 1441049599,
                    title: "Swansea 2-1 Manchester United: Talking points from Liberty Stadium"
                },
                {
                    image_url: "http://www.freemalaysiatoday.com/wp-content/uploads/2015/08/Poon-Fook-Loke_600.jpg",
                    view_count: 0,
                    description: "When Malaysia stood as one nation to beat World Cup champions Holland",
                    news_id: 5782091,
                    news_url: "http://www.freemalaysiatoday.com/category/nation/2015/08/30/unsurpassed-after-40-years-fook-loke-recalls-1975-greats/",
                    bookmark_count: 0,
                    created_at: 1441048843,
                    title: "Unsurpassed after 40 years: Fook Loke recalls 1975 greats"
                },
                {
                    image_url: "http://s1.firstpost.in/wp-content/uploads/2015/08/Dhammika-Prasad_AP_Wicket.jpg",
                    view_count: 0,
                    description: "Live scores and updates of day 4 of the 3rd Test between Sri Lanka and India.",
                    news_id: 5775937,
                    news_url: "http://www.firstpost.com/sports/sri-lanka-vs-india-3rd-test-day-4-live-kohli-rohit-look-to-rebuild-after-top-order-failure-2414172.html",
                    bookmark_count: 0,
                    created_at: 1441007143,
                    title: "Sri Lanka vs India 3rd Test, day 4 Live: Kohli fails again, onus on Rohit - Firstpost"
                },
                {
                    image_url: "http://manilastandardtoday.com/panel/_files/modbuild/wp-images/wp-content/uploads/2015/08/09b54_andres_bautista-300x300.jpg",
                    view_count: 0,
                    description: "THE Commission on Elections assured that the base source code to be installed in the vote count machines to be used next year will be known by October 15 even as...",
                    news_id: 5769043,
                    news_url: "http://manilastandardtoday.com/2015/08/30/poll-source-code-deal-hit/",
                    bookmark_count: 0,
                    created_at: 1440977361,
                    title: "Poll source code deal hit - The Standard"
                },
                {
                    image_url: "http://www.arabnews.com/sites/default/files/2015/08/28/file-28-1398608905028179600_0.jpg",
                    view_count: 0,
                    description: "RIYADH: The Ministry of Health announced on Friday that two more people were infected with the Middle East Respiratory Syndrome (MERS) coronavirus.",
                    news_id: 5762469,
                    news_url: "http://www.arabnews.com/featured/news/798586",
                    bookmark_count: 0,
                    created_at: 1440945236,
                    title: "MERS infections continue in capital"
                },
                {
                    image_url: "http://media.therakyatpost.com/wp-content/uploads/2015/08/slash.jpg",
                    view_count: 0,
                    description: "IT takes one, to know one. Rocker Slash, will be producing a slasher movie. According to The Hollywood Reporter, the Guns ‘n Roses and Velvet Revolver guitarist has been tapped to produce a horror flick with Revolver Picture Company. Though plot details aren’t yet available, the script is being penned by Brian Sieve, the writer …",
                    news_id: 5744999,
                    news_url: "http://www.therakyatpost.com/life/entertainment-life/2015/08/29/slash-is-producing-a-slasher-movie/",
                    bookmark_count: 0,
                    created_at: 1440842537,
                    title: "Slash is producing a slasher movie - The Rakyat Post"
                    }
                ]
            }
        ];
        return data;
    }

    this.get_user_score = function(){
        return {
            "ranking": 23,
            "score": 567,
            "games": 45
        }
    }

    this.get_game_users = function(){
        return [
            {
                "name": "Bhuwan",
                "id": 34567,
                "ranking": 2,
                "accuracy": 35,
                "image_url": "https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333&oe=565B011E"
            },
            {
                "name": "Bhuwan",
                "id": 34567,
                "ranking": 2,
                "accuracy": 35,
                "image_url": "https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333&oe=565B011E"
            },
            {
                "name": "Bhuwan",
                "id": 34567,
                "ranking": 2,
                "accuracy": 35,
                "image_url": "https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333&oe=565B011E"
            },
            {
                "name": "Bhuwan",
                "id": 34567,
                "ranking": 2,
                "accuracy": 35,
                "image_url": "https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333&oe=565B011E"
            },
            {
                "name": "Bhuwan",
                "id": 34567,
                "ranking": 2,
                "accuracy": 35,
                "image_url": "https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333&oe=565B011E"
            },
            {
                "name": "Bhuwan",
                "id": 34567,
                "ranking": 2,
                "accuracy": 35,
                "image_url": "https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333&oe=565B011E"
            },
            {
                "name": "Bhuwan",
                "id": 34567,
                "ranking": 2,
                "accuracy": 35,
                "image_url": "https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333&oe=565B011E"
            },
            {
                "name": "Bhuwan",
                "id": 34567,
                "ranking": 2,
                "accuracy": 35,
                "image_url": "https://scontent.xx.fbcdn.net/hprofile-xtp1/v/t1.0-1/p200x200/1549437_745546432181663_2556840033990065814_n.jpg?oh=33a5ac0efa0939444962a442dcafc333&oe=565B011E"
            }
        ];
    }

    this.get_game_books = function(){
        var data = [
            {
                "title": "The Road To Oxiana",
                "isbn": "9780195030679",
                "id": 491883,
                "author_id": 491884,
                "author_name": "Robert Byron",
                "rating": 8
            },
            {
                "title": "Does Harry Potter Tickle Sleeping Dragons",
                "isbn": "9780979422980",
                "id": 571940,
                "author_id": 571941,
                "author_name": "Nancy Solon Villaluz",
                "rating": 7
            },
            {
                "title": "Those Pricey Thakur Girls",
                "isbn": "9350296020",
                "id": 982875,
                "author_id": 504581,
                "author_name": "Anuja Chauhan",
                "rating": 8
            },
            {
                "title": "Lectures On Quantum Gravity",
                "isbn": "9780387239958",
                "id": 1933707,
                "author_id": 442323,
                "author_name": "Elliot Aronson",
                "rating": 6
            },
            {
                "title": "The Book Of Sports Cars",
                "isbn": "8896365449",
                "id": 2349246,
                "author_id": 2349247,
                "author_name": "charles lam markmann and mark sherwin",
                "rating": 7
            },
            {
                "title": "Health Psychology",
                "isbn": "9780471150749",
                "id": 753032,
                "author_id": 753033,
                "author_name": "Catherine A. Sanderson",
                "rating": 3
            },
            {
                "title": "Principles Of Conservation Biology",
                "isbn": "9780878935215",
                "id": 861855,
                "author_id": 861856,
                "author_name": "Gary K. Meffe",
                "rating": 6
            },
            {
                "title": "Principles Of Conservation Biology",
                "isbn": "9780321024350",
                "id": 861855,
                "author_id": 861856,
                "author_name": "Gary K. Meffe",
                "rating": 6
            },
            {
                "title": "Social Psychology: The Heart And The Mind",
                "isbn": "9780321024350",
                "id": 1933707,
                "author_id": 442323,
                "author_name": "Elliot Aronson",
                "rating": 6
            },
            {
                "title": "Social Psychology: The Heart And The Mind",
                "isbn": "9780321024350",
                "id": 1933707,
                "author_id": 442323,
                "author_name": "Elliot Aronson",
                "rating": 6
            }
        ];
        return data;
    }

    this.get_todos = function(){
        var data = {
            "home": {
                "profile": false,
                "filters": false,
                "rooms": false,
                "invite": false
            },
            "room": {
                "rating": true,
                "news": false
            },
            "rooms": {
                "join": false,
                "visit": false
            },
            "book": {
                "recommend": false,
                "author": false
            },
            "author": {
                "follow": false
            },
            "filters": {
                "shelf": false,
                "book": false
            },
            "profile": {
                "shelves": true,
                "history": true
            }
        };
        return data;
    }

    this.get_book_shelves =  function(){
        var data = [{"shelf":"Have left a mark on me","label_key":"HaveLeftAMarkOnMe","books":[{"published_year":"1922","popularity_index":7.2,"page_count":"152","book_reader_relationship_index":5.1,"author_name":"Hermann Hesse","id":390110,"goodness_index":6.7,"likeability_index":7.9,"isbn":"0553208845,9780553208849","title":"Siddhartha"}],"label_count":1,"dominant_color":null},{"shelf":"Currently reading","label_key":"CurrentlyReading","books":[],"label_count":1,"dominant_color":null},{"shelf":"Intending to read","label_key":"IntendingToRead","books":[{"published_year":"January 1st 2007","popularity_index":8.4,"page_count":"759","book_reader_relationship_index":5.8,"author_name":"J.K. Rowling","id":395598,"goodness_index":7.8,"likeability_index":9.1,"isbn":"0545010225,9780545010221","title":"Harry Potter and the Deathly Hallows"},{"published_year":"March 28th 1976","popularity_index":3.6,"page_count":"408","book_reader_relationship_index":6.3,"author_name":"Gayatri Devi","id":732319,"goodness_index":5.9,"likeability_index":7.8,"isbn":"8171673074,9788171673070","title":"A Princess Remembers: The Memoirs of the Maharani of Jaipur"},{"published_year":"June 7th 1996","popularity_index":2.0,"page_count":"0","book_reader_relationship_index":5.7,"author_name":"Tia DeNora","id":1141992,"goodness_index":5.0,"likeability_index":7.4,"isbn":"052162732X,9780521627320","title":"Music in Everyday Life"},{"published_year":"1980","popularity_index":4.0,"page_count":"208","book_reader_relationship_index":6.0,"author_name":"Carl Sagan","id":413634,"goodness_index":6.2,"likeability_index":8.7,"isbn":"0375508325,9780375508325","title":"Cosmos"},{"published_year":"1979","popularity_index":3.6,"page_count":"144","book_reader_relationship_index":4.8,"author_name":"R. A. Montgomery","id":491595,"goodness_index":5.2,"likeability_index":7.1,"isbn":"1933390034,9781933390031","title":"Space and Beyond"},{"published_year":"   ","popularity_index":null,"page_count":"","book_reader_relationship_index":null,"author_name":"Stephen W. Hawking","id":2433090,"goodness_index":null,"likeability_index":null,"isbn":"0553176986","title":"A Brief History of Time"},{"published_year":"1988","popularity_index":5.6,"page_count":"176","book_reader_relationship_index":5.2,"author_name":"Stephen Hawking","id":422349,"goodness_index":6.4,"likeability_index":8.3,"isbn":"0553804367,9780553804362","title":"A Briefer History of Time"},{"published_year":"1951","popularity_index":8.4,"page_count":"0","book_reader_relationship_index":5.1,"author_name":"J.D. Salinger","id":558129,"goodness_index":7.0,"likeability_index":7.5,"isbn":null,"title":"O Apanhador no Campo de Centeio"}],"label_count":8,"dominant_color":null},{"shelf":"Not worth reading","label_key":"NotWorthReading","books":[],"label_count":1,"dominant_color":null},{"shelf":"I own this","label_key":"IOwnthis","books":[],"label_count":1,"dominant_color":null},{"shelf":"Read","label_key":"Read","books":[],"label_count":1,"dominant_color":null},{"shelf":"Plan to buy","label_key":"PlanToBuy","books":[],"label_count":1,"dominant_color":null}];
        return data;
    }

    this.authors_interviewed = function(){
        var data = [
            {
            name: "Alex Rutherford",
            id: 386254,
            wiki_url: "http://google.co.in/url?q=http://en.wikipedia.org/wiki/Empire_of_the_Moghul&sa=U&ei=1hbTU_zwEq7JsQTP-YHgCg&ved=0CBMQFjAA&usg=AFQjCNEu7-zdCGnW25J58Y2Rwoz8Rd6O8A",
            overview: "Empire of the Moghul is a series of historical fiction novels written by Alex Rutherford (the pen name for Diana and Michael Preston). The series consists of five volumes covering the rise and height of the Moghul Empire in medieval India.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "Scott Anderson",
            id: 393941,
            wiki_url: "https://en.wikipedia.org/wiki/Scott_Anderson_(novelist)",
            overview: "Scott Anderson is an American novelist, journalist, and a veteran war correspondent. He wrote novels Triage, Moonlight Hotel, The Man Who tried to Save the World, and War Zones. He is a frequent contributor to for the New York Times Magazine, GQ, Esquire, Men’s Journal, Vanity Fair and other publications.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "Gilbert King",
            id: 402003,
            wiki_url: "https://en.wikipedia.org/wiki/Gilbert_King_(author)",
            overview: "Gilbert Anthony King (born February 22, 1962) is an American writer and photographer. He is known best as the author of Devil in the Grove: Thurgood Marshall, the Groveland Boys, and the Dawn of a New America (2012), which won the Pulitzer Prize. His previous book was The Execution of Willie Francis: Race, Murder, and the Search for Justice in the American South. He has written for The New York Times and The Washington Post, and he is a featured contributor to the Smithsonian's history blog Past Imperfect. As a photographer, his work has appeared in many magazines including international editions of Vogue, Harper's Bazaar, Marie Claire, and Cosmopolitan.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "John Edward Lawson",
            id: 482059,
            wiki_url: "",
            overview: "John Edward Lawson is an author, editor and poet living in the Maryland suburbs of Washington, DC. He is the author of ten books of fiction and poetry and seven chapbooks. Over 500 of his poems, stories, and articles have been published in magazines, anthologies, literary journals, and newspapers worldwide. John was a winner of the 2001 Fiction International Emerging Writers Competition; in addition to being a finalist for the Bram Stoker Award (2006, Superior Achievement in Poetry) and the Wonderland Award for Bizarro Fiction (2007, collected fiction), other award nominations include two for the Rhysling Award, two for the Dwarf Stars Award, and the Pushcart Prize. John is also a founding editor of Raw Dog Screaming Press. He spent four years as editor-in-chief of The Dream People online literary journal of bizarro fiction and poetry. Other editorial projects include three print anthologies, four e-anthologies, and freelance work for such companies as National Lampoon and Double Dragon Publishing. He has been involved in the production of numerous short films, including award winners Party Girl and Uberman: An Experiment in Consciousness. Director Jayson Densman has collaborated with John for years spawning a trilogy of PoVids derived from his poetry.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "Charles Glass",
            id: 546762,
            wiki_url: "http://en.wikipedia.org/wiki/Charles_Glass",
            overview: "Charles Glass (born 1951) is an American-British author, journalist, and broadcaster specializing in the Middle East. He writes regularly for The Spectator, was ABC News chief Middle East correspondent from 1983–93, and has worked as a correspondent for Newsweek and The Observer. His work has appeared in newspapers and magazines, and on television networks, all over the world. Glass is the author of Tribes With Flags: A Dangerous Passage Through the Chaos of the Middle East (1991) and a collection of essays, Money for Old Rope: Disorderly Compositions (1992). A sequel to Tribes with Flags, called The Tribes Triumphant, was published by Harper Collins in June 2006. His book on the beginning of the American war in Iraq, The Northern Front, was published in October 2006 by Saqi. His most recent book, Americans in Paris (Harper Collins), tells the story of the American citizens who chose to remain in Paris when the Germans occupied the city in 1940. He has received awards from the Overseas Press Club and the Commonwealth and George Foster Peabody Awards.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "Anatol Lieven",
            id: 561957,
            wiki_url: "https://en.wikipedia.org/wiki/Anatol_Lieven",
            overview: "Anatol Lieven is a professor in Georgetown University’s School of Foreign Service based in Doha, Qatar. He is a visiting professor in the War Studies Department of King’s College London and a senior fellow of the New America Foundation in Washington DC. His latest book, Pakistan: A Hard Country was published in 2011. From 1986 to 1998, Anatol Lieven worked as a British journalist in South Asia and the former Soviet Union, and is author of several books on Russia and its neighbours. From 2000 to 2007 he worked at think tanks in Washington DC. A new edition of his book America Right or Wrong: An Anatomy of American Nationalism was published in 2012.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "Michelle Morgan",
            id: 576711,
            wiki_url: "https://www.goodreads.com/author/show/269069.Michelle_Moran",
            overview: "Michelle Morgan (born July 16, 1981) is a Canadian actress and singer.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "Kwasi Kwarteng",
            id: 749182,
            wiki_url: "https://en.wikipedia.org/wiki/Kwasi_Kwarteng",
            overview: "Kwasi Alfred Addo Kwarteng (born 26 May 1975) is a British politician and historian. A member of the Conservative Party, he has served as a Member of Parliament (MP) since 2010 representing the constituency of Spelthorne in Surrey.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "Emma Griffin",
            id: 855908,
            wiki_url: "",
            overview: "Emma Griffin was educated at London and Cambridge and is now a historian of modern Britain at the University of East Anglia. She is the author of four books, most recently Liberty's Dawn: A People's History of the British Industrial Revolution, published by Yale UP in 2013, as well as many articles, essays and reviews in both academic and non-academic publications. Emma is a contributor to Radio 3's Night Waves and has made frequent appearances on radio and television, from Radio 4's In Our Time, to ITV3's Forensic Casebook. In 2012 she presented a Radio 4 documentary, Out Foxed, which looked at foxhunting in Britain since the Ban in 2005. A new radio documentary on her recent book, Liberty's Dawn, aired on Radio 4 in April and she is co-presenting 'The Real Mill' with Tony Robinson on Channel 4 in July. Please browse this website to find out more about her books and research on the social and history of Britain during the industrial revolution.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            },
            {
            name: "Anatol Lieven",
            id: 980313,
            wiki_url: "https://en.wikipedia.org/wiki/Anatol_Lieven",
            overview: "Anatol Lieven is a professor in Georgetown University’s School of Foreign Service based in Doha, Qatar. He is a visiting professor in the War Studies Department of King’s College London and a senior fellow of the New America Foundation in Washington DC. His latest book, Pakistan: A Hard Country was published in 2011. From 1986 to 1998, Anatol Lieven worked as a British journalist in South Asia and the former Soviet Union, and is author of several books on Russia and its neighbours. From 2000 to 2007 he worked at think tanks in Washington DC. A new edition of his book America Right or Wrong: An Anatomy of American Nationalism was published in 2012.",
            label: [
            "Author",
            "Active"
            ],
            location: "",
            books_count: null,
            is_interviewed: true,
            has_birthday: null
            }
        ];
        return data;
    }

    this.get_author_details = function(){
        var data = {"name":"Hermann Hesse","id":2547256,"wiki_url":"http://google.co.in/url?q=http://en.wikipedia.org/wiki/Hermann_Hesse\u0026sa=U\u0026ei=7AP-UtKYJIK_rgeCm4CgAg\u0026ved=0CB0QFjAA\u0026usg=AFQjCNFcKfslgQnuUkaOh7Otfc2IxoJXrQ","overview":"Hermann Hesse (German: [ˈhɛɐ̯man ˈhɛsə]; 2 July 1877 – 9 August 1962) was a German poet, novelist, and painter. His best-known works include Steppenwolf, Siddhartha, and The Glass Bead Game, each of which explores an individual's search for authenticity, self-knowledge and spirituality. In 1946, he received the Nobel Prize in Literature.","label":["Author"],"location":null,"books_count":null,"is_interviewed":null,"has_birthday":null,"books":[{"popularity":0,"published_year":null,"description":"=various works","page_count":"713","author_name":"Hermann Hesse","id":1165159,"isbn":null,"title":"Opere varie","own_status":null},{"popularity":137,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":1157358,"isbn":null,"title":"Klingsor's Last Summer and Other Stories","own_status":null},{"popularity":109,"published_year":null,"description":"=Trees. Reflections and poems","page_count":"141","author_name":"Hermann Hesse","id":1165814,"isbn":"3458321551,9783458321552","title":"BÃ¤ume. Betrachtungen und Gedichte","own_status":null},{"popularity":0,"published_year":null,"description":"=From India. Memories","page_count":"363","author_name":"Hermann Hesse","id":1151533,"isbn":"3518370626,9783518370629","title":"Aus Indien. Erinnerungen","own_status":null},{"popularity":49,"published_year":null,"description":"Die ErzÃ¤hlungen des vierten Bandes unserer Edition schrieb Hesse im Alter von 31 bis 33 Jahren. Sechs davon, die populÃ¤ren Gerbersau-Geschichten \"Die Verlobung\", \"Die Heim kehr\", \"Ladidel\" und \"Emil Kolb\" sowie die Kurzgeschichten \"Ein Mensch mit Namen Ziegler\" und \"Die Stadt\" hat Hesse selbst in seine BÃ¼cher aufgenommen, die Ã¼brigen nur in Zeitschriften und Zeitungen verÃ¶ffentlicht. Den grÃ¶Ãten Erfolg dieser weniger bekannten Arbeiten hatte die ErzÃ¤hlung \"Freunde\". \"Abschied\" und die humoristischen Schilderungen \"Die Wunder der Technik\", \"Aus dem Briefwechsel eines Dichters\" und \"WÃ¤risbÃ¼hel\" haben autobiographischen Charakter, aber auch Berichte wie \"Taedium vitae\" und \"Haus zum Frieden\", einem VorlÃ¤ufer von Hesses berÃ¼hmten \"Kurgast\"-Aufzeichnungen von 1924. Die Kurzgeschichte \"Die Stadt\" ist Hesses wohl aktuellste Arbeit, die im Zeitraffertempo einen kompletten kultur- und entwicklungsgeschichtlichen AbriÃ des Werde- und Niedergangs unseres zivilisatorischen Fortschritts entwirft.","page_count":"80","author_name":"Hermann Hesse","id":1155171,"isbn":"3518377019,9783518377017","title":"Die Heimkehr","own_status":null},{"popularity":0,"published_year":null,"description":"Sept nouvelles sont rÃ©unies dans ce volume, Ã©crites au cours d'une trentaine d'annÃ©es, elles expriment le lyrisme philosophique et la mÃ©lancolie existentielle de l'auteur. Oeuvres de jeunesse ou de maturitÃ©, ces nouvelles reflÃ¨tent  un des thÃ©mes fondamentaux de l'auteur: la solitude commune au jeune homme aussi bien qu'au vieillard devant un monde qu'ils ne reconnaissent pas.","page_count":"214","author_name":"Hermann Hesse","id":704465,"isbn":null,"title":"Les frÃ¨res du soleil","own_status":null},{"popularity":192190,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":918878,"isbn":"970070629X,9789700706290","title":"Demian. Siddartha.","own_status":null},{"popularity":108,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":997309,"isbn":"3518366297,9783518366295","title":"Materialien zu Hermann Hesses Siddharta 1. Texte von Hermann Hesse","own_status":null},{"popularity":0,"published_year":null,"description":"Î£ÏÎ¿ BÏÎ¿ÏÎ¿ÏÎ¿Î¹Ï, Î¿ MÎ¬Î³Î¿Ï-BÏÎ¿ÏÎ¿ÏÎ¿Î¹ÏÏ KÎ½ÎµÏÏ (ÏÎ¿Ï ÏÎ·Î¼Î±Î¯Î½ÎµÎ¹ Â«ÏÏÎ·ÏÎ­ÏÎ·ÏÂ» ÏÏÎ± Î³ÎµÏÎ¼Î±Î½Î¹ÎºÎ¬) ÎµÎ½ÏÎ±ÏÎºÏÎ½ÎµÎ¹ Î±ÏÏÎ® ÎºÎ±Î¸Î±ÏÏÎ® ÏÎ·Î½ ÏÏÎ¿ÏÏÎ¬Î¸ÎµÎ¹Î± ÏÎ¿Ï Î±ÏÏÎ­Î³Î¿Î½Î¿Ï Î±Î½Î¸ÏÏÏÎ¿Ï Î½Î± ÎµÎ½Î±ÏÎ¼Î¿Î½Î¹ÏÏÎµÎ¯ Î¼Îµ Ï,ÏÎ¹ Î±ÏÎµÎ¹Î»Î·ÏÎ¹ÎºÏ ÏÎ¿Î½ ÏÎµÏÎ¹Î²Î¬Î»Î»ÎµÎ¹ ÎºÎ±Î¹ Î½Î± ÏÏÎ¼ÏÎ¹Î»Î¹ÏÎ¸ÎµÎ¯ Î¼Îµ Ï,ÏÎ¹ Î¬Î³Î½ÏÏÎ¿ ÎºÎ±Î¹ ÎµÏÎ¯Î²Î¿ÏÎ»Î¿ ÏÎºÎ¹ÏÏÎ¬ ÎµÎ½ÏÏÏ ÏÎ¿Ï.Î£ÏÎ¿Î½ EÎ¾Î¿Î¼Î¿Î»Î¿Î³Î·ÏÎ®, Î¿ IÏÏÎ®Ï Î¦Î¬Î¼Î¿ÏÎ»Î¿ÏÏ (ÏÎ¿Ï ÏÎ·Î¼Î±Î¯Î½ÎµÎ¹ Â«ÏÏÎ·ÏÎ­ÏÎ·ÏÂ» ÏÏÎ± Î»Î±ÏÎ¹Î½Î¹ÎºÎ¬) Î¾Î±Î½Î¿Î¯Î³ÎµÏÎ±Î¹ ÏÏÎ·Î½ ÏÏÎ±Î³Î¼Î±ÏÎ¹ÎºÎ® Î­ÏÎ·Î¼Î¿ ÎºÎ¬ÏÎ¿Î¹Î± Î¼Î±ÎºÏÎ¹Î½Î® ÏÏÏÏÎ¿ÏÏÎ¹ÏÏÎ¹Î±Î½Î¹ÎºÎ® ÎµÏÎ¿ÏÎ® Î³Î¹Î± Î½Î± Î²ÏÎµÎ¹ Î¼Î­ÏÎ± Î±Ï' ÏÎ·Î½ Î­ÏÎ·Î¼Î¿ ÏÎ·Ï ÏÏÏÎ®Ï ÏÎ¿Ï ÏÎ¿ Î¸ÏÏÎ»Î¿ÏÎ¼ÎµÎ½Î¿ ÎÎµÏ. O ÎÏÏÎµ Î±Î½Î±Î´ÎµÎ¹ÎºÎ½ÏÎµÏÎ±Î¹ ÎµÎ´Ï ÏÏÎ­ÏÎ¼Î±ÏÎ¿Ï Î¼Î¹Î±Ï Î±Î½ÏÏÎµÏÎ·Ï Î½Î¿Î¼Î¿ÏÎ­Î»ÎµÎ¹Î±Ï, Î±ÏÎ¿Î²Î»Î­ÏÎ¿Î½ÏÎ±Ï ÏÎµ Î¼Î¹Î± ÏÎ¿Î¯Î·ÏÎ· ÏÎ¿Ï Î½' Î±ÏÎ¿ÏÎµÎ»ÎµÎ¯ Â«Î­Î½Î± Î¼ÎµÎ³Î±Î»ÎµÎ¹ÏÎ´ÎµÏ ÏÎ¿Î»Î¼Î·ÏÏ ÏÏÎ±Î³Î¿ÏÎ´Î¹ ÏÎ·Ï Î½Î¿ÏÏÎ±Î»Î³Î¯Î±Ï ÎºÎ±Î¹ ÏÎ·Ï Î¶ÏÎ®ÏÂ».TÎ­Î»Î¿Ï, Î¼Îµ ÏÎ¿Î½ NÏÎ¬ÏÎ±, ÏÏÎ·Î½ IÎ½Î´Î¹ÎºÎ® BÎ¹Î¿Î³ÏÎ±ÏÎ¯Î± (NÏÎ¬ÏÎ± ÏÎ·Î¼Î±Î¯Î½ÎµÎ¹ Â«ÏÏÎ·ÏÎ­ÏÎ·ÏÂ» ÏÏÎ± ÏÎ±Î½ÏÎºÏÎ¹ÏÎ¹ÎºÎ¬), Î¿ ÎÏÎ¼Î±Î½ ÎÏÏÎµ ÏÎ±Î½ÏÏÎµÏÎµÎ¹ ÏÎ¿ Î¼ÏÏÏÎ¹ÎºÎ¹ÏÎ¼Ï ÏÎ·Ï AÎ½Î±ÏÎ¿Î»Î®Ï Î¼Îµ ÏÎ¿Î½ Î¿ÏÎ¸Î¿Î»Î¿Î³Î¹ÏÎ¼Ï ÏÎ·Ï ÎÏÏÎ·Ï, ÏÎ· Î¼Î­Î¸Î· Î¼Îµ ÏÎ· ÏÎ±ÏÎ®Î½ÎµÎ¹Î±, Î¿Î»Î¿ÎºÎ»Î·ÏÏÎ½Î¿Î½ÏÎ±Ï Î¿ÏÏÎ¹Î±ÏÏÎ¹ÎºÎ¬ ÏÎ·Î½ ÏÏÎ¯ÏÎ· Î¼ÎµÏÎµÎ½ÏÎ¬ÏÎºÏÏÎ· ÏÏÎ¿ ÏÎ±ÏÎµÎ»Î¸ÏÎ½ ÏÎ¿Ï Â«Î¸Î±Î½Î±ÏÎ¿Î»Î¬ÏÏÎ· EÏÏÏÏÎ±Î¯Î¿ÏÂ», ÏÎµ Î¼Î¹Î± ÏÏÎ½Î¸ÎµÏÎ· ÏÏÎ¿Ï ÏÎ± Î²Î®Î¼Î±ÏÎ± ÏÎ¿Ï XÏÏÎ½Î¿Ï Î·ÏÎ¿ÏÎ½ ÎµÎºÎºÏÏÎ±Î½ÏÎ¹ÎºÎ¬ Î¼Î­Ï' Î±ÏÏ ÏÎ¿ÏÏ ÏÎ±Î»Î¼Î¿ÏÏ ÏÎ¿Ï Î£ÏÎ¼ÏÎ±Î½ÏÎ¿Ï.","page_count":"152","author_name":"Hermann Hesse","id":1143541,"isbn":null,"title":"Î ÎÏÎ¿ÏÎ¿ÏÎ¿Î¹ÏÏ - Î ÎÎ¾Î¿Î¼Î¿Î»Î¿Î³Î·ÏÎ®Ï - ÎÎ½Î´Î¹ÎºÎ® ÎÎ¹Î¿Î³ÏÎ±ÏÎ¯Î±","own_status":null},{"popularity":0,"published_year":null,"description":"ÎÎ­Î½Î½Î·Î¼Î± Î¼Î¹Î±Ï ÏÏÎ¿Î½Î¹Î¬Ï ÏÎ·Î¼Î±Î´Î¹Î±ÎºÎ®Ï Î³Î¹Î± ÏÎ·Î½ ÎµÎ¾Î­Î»Î¹Î¾Î· ÏÎ¿Ï ÏÏÎ³Î³ÏÎ±ÏÎ­Î± ÎÏÎ¼Î±Î½ ÎÏÏÎµ, Î±Î»Î»Î¬ ÎºÎ±Î¹ Î³Î¹Î± ÏÎ·Î½ ÎÏÏÏÏÎ· ÎºÎ±Î¹ ÏÎ¿Î½ ÎºÏÏÎ¼Î¿ ÏÎ¿Ï 1919 -ÏÏÎ¿Î½Î¹Î¬Ï ÏÎ¿Ï ÏÎµÎ»ÎµÎ¹ÏÎ½ÎµÎ¹ Î¿ Î ÏÏÏÎ¿Ï Î Î±Î³ÎºÏÏÎ¼Î¹Î¿Ï Î ÏÎ»ÎµÎ¼Î¿Ï- Î¿Î¹ ÎÏÎ¸Î¿Î¹ Î±ÏÎ¿ÏÎµÎ»Î¿ÏÎ½ Î­Î½Î± ÎºÎ±Î»ÎµÎ¹Î´Î¿ÏÎºÏÏÎ¹Î¿  ÏÏÎ¿ Î¿ÏÎ¿Î¯Î¿ Î´Î¹Î±ÎºÏÎ¯Î½Î¿Î½ÏÎ±Î¹ ÎµÏÎºÏÎ¹Î½ÏÏ Î¿Î¹ Î¼Î¿ÏÏÎ­Ï, ÏÎ± Î³ÎµÏÎ¼ÎµÏÏÎ¹ÎºÎ¬ ÏÏÎ®Î¼Î±ÏÎ±, Î¿Î¹ ÏÏÏÎ¼Î±ÏÎ¹ÎºÎ¿Î¯ ÏÏÎ½Î¿Î¹ ÎºÎ±Î¹ Î¿Î¹ Î¼Î¿ÏÏÎ¹ÎºÎ¿Î¯ ÏÎ¸ÏÎ³Î³Î¿Î¹ ÏÎ¿Ï ÏÎµÏÎ¬ÏÏÎ¹Î¿Ï ÎºÎ±Î¹ ÏÎ¿Î»ÏÏÎ®Î¼Î±Î½ÏÎ¿Ï Î­ÏÎ³Î¿Ï ÏÎ¿Ï. Î ÏÎ¬Î»Î· Î¼Îµ ÏÎ·Î½ ÏÎºÎ¿ÏÎµÎ¹Î½Î® ÏÎ»ÎµÏÏÎ¬ ÏÎ¿Ï ÎµÎ±ÏÏÎ¿Ï ÏÎ¿ÏÏ Î±ÏÎ¿ÏÎµÎ»ÎµÎ¯ ÏÎ¿ Î¿ÏÏÎ¹Î±ÏÏÎ¹ÎºÏ Î­ÏÎ³Î¿ Î¶ÏÎ®Ï ÏÎ»ÏÎ½ Î±Î½ÎµÎ¾Î±Î¹ÏÎ­ÏÏÏ ÏÏÎ½ Î·ÏÏÏÎ½ ÏÏÎ½ ÎÏÎ¸ÏÎ½.","page_count":"174","author_name":"Hermann Hesse","id":1143493,"isbn":null,"title":"ÎÏÎ¸Î¿Î¹ - ÎÎºÏÏ ÎÏÏÎ¿ÏÎ¯ÎµÏ","own_status":null},{"popularity":0,"published_year":null,"description":"Fictional accounts of German student life in three different historical periods center on the relationships among young men and attempts to reconcile the spiritual and the secular","page_count":"233","author_name":"Hermann Hesse","id":721195,"isbn":"0374272484,9780374272487","title":"Tales of Student Life","own_status":null},{"popularity":14,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":1670985,"isbn":"8420616958,9788420616957","title":"Cuentos, 3","own_status":null},{"popularity":0,"published_year":null,"description":null,"page_count":"252","author_name":"Hermann Hesse","id":1877699,"isbn":null,"title":"Gesta Romanorum. Das Ã¤lteste MÃ¤rchen- und Legendenbuch des Mittelalters","own_status":null},{"popularity":0,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":1949845,"isbn":"4102001107,9784102001103","title":"Chi To Ai","own_status":null},{"popularity":192190,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":2291389,"isbn":"970070629X,9789700706290","title":"Demian / Siddartha","own_status":null},{"popularity":0,"published_year":null,"description":"Nova antologia de contos inÃ©ditos de um dos autores alemÃ£es mais vendidos em todo o mundo!","page_count":"263","author_name":"Hermann Hesse","id":2307967,"isbn":null,"title":"Regresso a Casa e Outros Contos","own_status":null},{"popularity":0,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":2118207,"isbn":null,"title":"Poesie. Testo tedesco a fronte","own_status":null},{"popularity":16,"published_year":null,"description":"Composte negli anni 1895-1962, le 52 poesie di Hermann Hesse che qui si raccolgono, nella traduzione di celebri poeti e germanisti italiani, rappresentano un contributo fondamentale alla conoscenza di una delle voci piÃ¹ impirtanti del '900 letterario europeo. Ispirate all'esperienza del dolore finalizzata al conoscere,in un linguaggio lirico di facile comprensione, esse fanno da contrappunto all'opera narrativa e saggistica hessiana. \"La serenitÃ  di Hesse lirico - scrive Ferruccio Masini nell'introduzione - sembra costituire la linfa segreta del gioco armonico di rapporti di cui si strutturano i movimenti leggeri dei suoi versi, gli arabeschi musicali delle sue visioni, gli esili ocntorni dei suoi scorci di paesaggio dipinti con la sottile eleganza di un maestro cinese...\"Una serenitÃ  che si va accrescendo (dice lo stesso Hesse) \"con l'etÃ  e con la vicinanza della morte\" ed altro non Ã¨ se non \"suprema conoscenza e amore, affermazione della realtÃ  tutta, un vegliare all'orlo di ogni voragine e di ogni abisso\"","page_count":"66","author_name":"Hermann Hesse","id":2112614,"isbn":null,"title":"Cinquantadue poesie","own_status":null},{"popularity":0,"published_year":null,"description":"=Unity behind the contradictions. Religions and myths","page_count":"210","author_name":"Hermann Hesse","id":2234727,"isbn":null,"title":"Religione E Mito","own_status":null},{"popularity":0,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":2098621,"isbn":null,"title":"Huilunsoittaja","own_status":null},{"popularity":3,"published_year":null,"description":"Â»Hermann Hesse zÃ¤hlt zweifellos zu den bedeutendsten Lyrikern des 20. Jahrhunderts. Das beruht vor allem auf der hohen QualitÃ¤t seiner Verse, die den Rhythmus und die Melodik der Musik aufgreifen. Dadurch gelingt es ihm auf unnachahmliche Weise, die Schwerkraft der Sprache zu Ã¼berwinden und uns so in den Farben- und Formenreichtum einer âºtaumelnden Weltâ¹ zu entfÃ¼hren. Dieser kleine Geschenkband versammelt eine reprÃ¤sentative Auswahl aus dem lyrischen Werk Hermann Hesses, der in sechzig Jahren rund 1400 Gedichte verfasst hat.Â«Ursula Hirsch, BrÃ¼ckenschlag Oktober 2008","page_count":"176","author_name":"Hermann Hesse","id":2097484,"isbn":null,"title":"Taumelbunte Welt: Hundert Gedichte","own_status":null},{"popularity":0,"published_year":null,"description":"=Other novels and poemsIn forme di classica compostezza, Hesse ha dato voce poetica alla dialettica tra ragione e sentimento, sensualitÃ  e spiritualitÃ . Il suo interesse per le religioni orientali gli ha valso una durevole fortuna presso nuove generazioni di lettori, dai quali Ã¨ considerato un vero e proprio autore di culto. Il secondo volume delle opere dell'autore in edizione i Meridiani nel quale spiccano Narciso e Boccadoro, le riflessioni della Psicologia balneare e una scelta dall'opera poetica.","page_count":"730","author_name":"Hermann Hesse","id":2111368,"isbn":null,"title":"Altri romanzi e poesie","own_status":null},{"popularity":0,"published_year":null,"description":null,"page_count":"63","author_name":"Hermann Hesse","id":2088212,"isbn":null,"title":"SeÃ§ilmiÅ Åiirler 1896 -1962","own_status":null},{"popularity":422,"published_year":null,"description":"=Interior RouteAlma de niÃ±o-Klein y Wargner-El ultimo verano de Klingsor","page_count":"162","author_name":"Hermann Hesse","id":2024115,"isbn":null,"title":"La Ruta Interior","own_status":null},{"popularity":0,"published_year":"January 1st 197","description":null,"page_count":"0","author_name":"Hermann Hesse","id":2096706,"isbn":"3518402978,9783518402979","title":"Tessin: Betrachtungen, Gedichte Und Aquarelle Des Autors","own_status":null},{"popularity":0,"published_year":null,"description":"Diese Gedichtauswahl, vom Autor ein Jahr vor seinem Tode besorgt, ist letztgÃ¼ltig. Sie umfaÃt etwa ein FÃ¼nftel seines gesamten lyrischen CEuvres. Ãber Hesses Gedichte schrieb Max Herrmann-NeiÃe: \"Von der vielen Lyrik, die ich las, talentierter und hoffnungslos unbegabter, epigonenhafter, chansonkesser, dÃ¼sterer und glÃ¤ubiger, freiwillig und unfreiwillig heiterer, ist Hesses Lyrik diejenige, die am klarsten und zuverlÃ¤ssigsten Menschliches kÃ¼nstlerisch, KÃ¼nstlerisches menschlich gibt. Man kann ihr nur im Tone herzlicher Verehrung und Zuneigung seinen Dank bekunden.\"","page_count":"250","author_name":"Hermann Hesse","id":2091948,"isbn":"3518013424,9783518013427","title":"Stufen. AusgewÃ¤hlte Gedichte","own_status":null},{"popularity":null,"published_year":null,"description":null,"page_count":null,"author_name":"Hermann Hesse","id":2512312,"isbn":null,"title":"The Fairy Tales of Herman Hesse","own_status":null},{"popularity":0,"published_year":null,"description":null,"page_count":"3","author_name":"Hermann Hesse","id":2313361,"isbn":null,"title":"Ú©ÙØ³ØªØ§ÙØªÛÙ","own_status":null},{"popularity":8,"published_year":null,"description":null,"page_count":"6","author_name":"Hermann Hesse","id":2313529,"isbn":null,"title":"Ù¾Ø±ÙØ§ÙÙ","own_status":null},{"popularity":272,"published_year":null,"description":"An anthology of the writings of the celebrated German novelist and Nobel laureate.","page_count":"264","author_name":"Hermann Hesse","id":2314848,"isbn":null,"title":"Siddhartha, Demian, and Other Writings","own_status":null},{"popularity":0,"published_year":null,"description":"Sa vie durant, Hermann Hesse Ã©crivit des nouvelles : les cinq ici rassemblÃ©es - la premiÃ¨re date de 1896, la derniÃ¨re de 1949 - sont emblÃ©matiques d'une quÃªte toujours poursuivie par l'Ã©crivain, celle de la vÃ©ritÃ©. Et de Mon enfance, exploitant le thÃ¨me de la nature, Ã  Mon camarade Martin et la LeÃ§on interrompue, Ã©voquant les amitiÃ©s scolaires de la premiÃ¨re jeunesse, en passant par Histoire de mon Novalis qui dit la joie de la lecture ou le Mendiant, qui interroge les conflits entre la pauvretÃ© et la richesse, on retrouve tout entiÃ¨re la sensibilitÃ© et la maÃ®trise du grand Ã©crivain.","page_count":"195","author_name":"Hermann Hesse","id":2311068,"isbn":"2742705430,9782742705436","title":"La leÃ§on interrompue","own_status":null},{"popularity":0,"published_year":null,"description":"=New Stories of Love","page_count":"0","author_name":"Hermann Hesse","id":2312511,"isbn":null,"title":"Cuentos de Amor","own_status":null},{"popularity":2,"published_year":null,"description":null,"page_count":"8","author_name":"Hermann Hesse","id":2313359,"isbn":null,"title":"Ú©ÙØ¯Ú©Û Ù Ø¬Ø§Ø¯Ù","own_status":null},{"popularity":12,"published_year":null,"description":null,"page_count":"10","author_name":"Hermann Hesse","id":2313360,"isbn":null,"title":"Ø§ÛÙ Ø¢ÙØ§Û ÙÙÙØ¯Û","own_status":null},{"popularity":4,"published_year":null,"description":"Das Japan, von welchem diese Geschichten erzÃ¤hlen, existiert heute nicht mehr. Die Ideale, auf welchen der Bau jener Ã¼beraus kraftvollen, dabei so schÃ¶nheitsfrohen Kultur errichtet war, sind heute zum Teil schon veraltet und vergessen, zum Teil bestehen sie noch als Reste der Vergangenheit, deren Macht tÃ¤glich mehr schwindet. â¦ Die Geschichten unsres Buches zeigen das alte, vergangene, schÃ¶ne Japan, wie es einmal war, das Japan der adligen, kriegerischen, aristokratischen Ideale.","page_count":"139","author_name":"Hermann Hesse","id":1540032,"isbn":null,"title":"Geschichten aus Japan. Die Welt erzÃ¤hlt... Die schÃ¶nsten Geschichten aus Japan - AusgewÃ¤hlt von Hermann Hesse","own_status":null},{"popularity":6157,"published_year":null,"description":"s/t: ErlÃ¤uterungen und Materialien","page_count":"0","author_name":"Hermann Hesse","id":1345086,"isbn":"3804416993,9783804416994","title":"Demian/Siddharta/Der Steppenwolf","own_status":null},{"popularity":354,"published_year":null,"description":"This collection of poems, written during the same period as Steppenwolf, was first published in 1928 in a limited edition of 1,000 copies.Â Â Hesse's uneasiness about the degree of self-exposure in these quite untypical poems is evident in that the majority (and many of the best) were never reprinted during his lifetime.Â  Astonishingly frank and raw at times, they reflect his effort to balance the constraints of his intellectual life with his longing for the free experiences of the senses.Â  Together with Steppenwolf--the link with that novel is unmistakable--Crisis served as a catharsis for Hesse, bringing to its climax a difficult period of questioning and despair.","page_count":"121","author_name":"Hermann Hesse","id":1172006,"isbn":"0374512515,9780374512514","title":"Crisis: Pages from a Diary","own_status":null},{"popularity":0,"published_year":null,"description":"Oameni precum Knulp \"nu sunt, ce-i drept, folositori; Ã®n schimb, sunt mult mai puÅ£in dÄunÄtori decÃ¢t majoritatea celor folositori. Atunci cÃ¢nd un astfel de Knulp, Ã®nzestrat cu suflet Åi talent, nu-Åi aflÄ locul Ã®n lume, lumea e Åi ea la fel de vinovatÄ ca Ã®nsuÅi Knulp\". Hermann Hesse \"De neuitat rÄmÃ¢ne impresia de-a dreptul electrizantÄ pe care demian-ul acelui misterios Sinclair a provocat-o din clipa apariÅ£iei sale; o povestire ce atingea cu Ã®nspÄimÃ¢ntÄtoare claritate nervul timpului, primitÄ cu Ã®ncÃ¢ntare Åi recunoÅtinÅ£Ä de o Ã®ntreagÄ generaÅ£ie ce-Åi regÄsea Ã®n ea cele mai adÃ¢nci simÅ£Äminte.\" Thomas Mann","page_count":"288","author_name":"Hermann Hesse","id":2008086,"isbn":null,"title":"Knulp. Demian","own_status":null},{"popularity":0,"published_year":null,"description":"Scrise si publicate la interval de mai multi ani - 1910, 1914 respectiv 1920 - cele trei proze reunite in acest volum au un element comun: desi in moduri diferite, ele abordeaza problematica artistului. Gertrud este povestea a doi prieteni muzicieni, complet deosebiti prin fire si destin, uniti si despartiti prin dragostea lor pentru aceleasi femei; Rosshalde, povestea unei casnicii de artist sortita destramarii; in timp ce ultima vara a lui Klingsor evoca ultimele luni din existenta unui pictor a carui sete de viata si intensitate a creatiei ne trimit cu gindul la destinul lui Vincent Van Gogh.","page_count":"384","author_name":"Hermann Hesse","id":2017654,"isbn":null,"title":"Gertrud. Rosshalde. Ultima vara a lui Klingsor","own_status":null},{"popularity":0,"published_year":null,"description":null,"page_count":"337","author_name":"Hermann Hesse","id":1963130,"isbn":null,"title":"Rosshalde/Peter Camenzind","own_status":null},{"popularity":0,"published_year":"January 1st 32767","description":null,"page_count":"0","author_name":"Hermann Hesse","id":1949884,"isbn":"4102001077,9784102001073","title":"KyoÌshuÌ: PeÌtaÌ KaÌmenchinto","own_status":null},{"popularity":0,"published_year":null,"description":null,"page_count":"0","author_name":"Hermann Hesse","id":1951235,"isbn":"3518365800,9783518365809","title":"Suhrkamp TaschenbÃ¼cher, Nr.80, Materialien Zu Hermann Hesse 'Das Glasperlenspiel'","own_status":null},{"popularity":12822,"published_year":null,"description":null,"page_count":"153","author_name":"Hermann Hesse","id":1943999,"isbn":null,"title":"Ø£Ø­ÙØ§Ù Ø§ÙÙØ§Ù","own_status":null},{"popularity":438,"published_year":"1st 1916","description":null,"page_count":"95","author_name":"Hermann Hesse","id":1151373,"isbn":"8879830031,9788879830034","title":"Bella Ã¨ la gioventÃ¹","own_status":null},{"popularity":24,"published_year":"January 1st 2004","description":"Il lupo della steppaKnulpDemianAnimo infantileKlein e WagnerL'ultima estate di KlingsorSiddharta","page_count":"844","author_name":"Hermann Hesse","id":1154525,"isbn":null,"title":"Romanzi","own_status":null},{"popularity":0,"published_year":"July 2002","description":"=The Night of JuneUn libro poco conocido que encantarÃ¡ a los amantes de Hermann Hesse.Los relatos que reÃºne esta excepcional antologÃ­a fueron publicados entre 1900 y 1908. En esta obra temprana se encuentran ya los que son elementos caracterÃ­sticos de la obra de Hesse: la descripciÃ³n poÃ©tica del tiempo que se va, la admiraciÃ³n por la belleza inabarcable de la naturaleza y la exploraciÃ³n de los eternos problemas de la existencia del ser humano. AsÃ­, con gracia y delicadeza, Hesse se hace cÃ³mplice de los sufrimientos de un joven en busca del amor puro y de la felicidad, dibuja con deleite una noche de verano y envuelve al lector con la calidez de sus evocaciones de paisajes, amables o melancÃ³licos. ","page_count":"0","author_name":"Hermann Hesse","id":2305984,"isbn":"8476694946,9788476694947","title":"La Noche de Junio","own_status":null},{"popularity":0,"published_year":"April 1st 2002","description":null,"page_count":"0","author_name":"Hermann Hesse","id":1661830,"isbn":"3518038885,9783518038888","title":"Hermann Hesse ALS Maler: 44 Aquarelle","own_status":null},{"popularity":0,"published_year":"2001","description":null,"page_count":"118","author_name":"Hermann Hesse","id":1541824,"isbn":"3518223410,9783518223413","title":"Der Zauberer. Fragmente zu einem Roman","own_status":null},{"popularity":98,"published_year":"1999","description":null,"page_count":"0","author_name":"Hermann Hesse","id":1657367,"isbn":null,"title":"Ø§ÙØ³Ø§ÙÙ Ù Ø³ÛØ²Ø¯Ù Ø¯Ø§Ø³ØªØ§Ù Ø¯ÛÚ¯Ø±","own_status":null},{"popularity":44,"published_year":"January 1st 1998","description":null,"page_count":"218","author_name":"Hermann Hesse","id":2340075,"isbn":null,"title":"Hans","own_status":null},{"popularity":0,"published_year":"1994","description":"Als Hermann Hesse sein MÃ¤rchen 'Der Dichter' schrieb, war er 35 Jahre alt. Noch vier Jahre spÃ¤ter hatte diese Geschichte vom chinesischen Poeten Han Fook so wenig an Bedeutung fÃ¼r ihn verloren, daÃ er sie fÃ¼r eine Rundfunksendung auf Tonband sprach. es ist seine frÃ¼heste, selbst gelesene ErzÃ¤hlung, die uns als Tondokument Ã¼berliefert ist. Sie zeigt Hesses Wahlverwandtschaft mit den Kulturen Ostasiens und nimmt Motive aus spÃ¤teren Dichtungen wie 'Siddhartha' und 'Das Glasperlenspiel' vorweg. Das gilt auch fÃ¼r die hier erstmals publizierten Tondokumente seiner Gedichte 'Der BlÃ¼tenzweig', 'Bericht des SchÃ¼lers' und 'FrÃ¼hlingstag'. Die ErzÃ¤hlung 'Der Wolf' (1902) und die zeitkritische, im ersten Weltkrieg pseudonym erschienene Fabel 'Der EuropÃ¤er' liest Siemen RÃ¼haak. Eine aussergewÃ¶hnlich schÃ¶ne CD auf welcher Hesse liest. Warm, geradlinig, besinnlich erzÃ¤hlt er die Geschichten und trÃ¤gt die Gedichte vor. Seine Stimme hat eine eigene Faszination, es ist ergreifend dieser zuzuhÃ¶ren. Eine wunderbare Bereicherung fÃ¼r den Leser, der die BÃ¼cher von Hermann Hesse liest.Copyright buechertreff.de","page_count":"0","author_name":"Hermann Hesse","id":2304485,"isbn":"3895847291,9783895847295","title":"Der Dichter. MÃ¤rchen, ErzÃ¤hlungen und Gedichte","own_status":null},{"popularity":181,"published_year":"January 1st 1993","description":"=Every beginning there is a charm. Life stages","page_count":"0","author_name":"Hermann Hesse","id":1154777,"isbn":"3518035843,9783518035849","title":"Jedem Anfang wohnt Ein Zauber Inne. Lebensstufen","own_status":null},{"popularity":234,"published_year":"September 1st 1993","description":"TÃ¼rk okurunun Ã¶zellikle BozkÄ±rkurdu, Boncuk Oyunu, Siddhartha adlÄ± kitaplarÄ±yla tutkulu bir iliÅki kurduÄu Hermann Hesse, yazar meslektaÅlarÄ±nÄ±n saygÄ±nlÄ±ÄÄ±nÄ± ve birbirini izleyen pek Ã§ok kuÅaÄÄ±n sevgisini kazanmÄ±Å, Ã§eÅitli dillere Ã§evrilen yapÄ±tÄ± dÃ¼nyanÄ±n her kÄ±tasÄ±nda okunan bir yazar konumuna ulaÅmÄ±ÅtÄ±r. Hugo Ballâin Romantizmin ihtiÅamlÄ± ordusunun son ÅÃ¶valyesi olarak nitelediÄi Hesse iÃ§in Thomas Mann yazÄ±nsal etkinliÄinin erken dÃ¶neminde âkendime en yakÄ±n bulduÄum, yazarlar arasÄ±ndan seÃ§ip en Ã§ok sevgiyle baÄlandÄ±ÄÄ±m yazarâ ifadesini kullanmÄ±Å, Peter Handke 1970âte Hesse rÃ¶nesansÄ±nÄ±n doruk noktasÄ±nda âHesse hiÃ§ kuÅkusuz ne yaptÄ±ÄÄ±nÄ± bilen, bÃ¼tÃ¼n deÄerlendirmelerden alnÄ±nÄ±n akÄ±yla Ã§Ä±kacak bÃ¼yÃ¼k bir yazardÄ±râ demiÅtir. YapÄ±tÄ±nda, yaÅamÄ±n bÃ¼yÃ¼k karÅÄ±tlÄ±klarÄ±nÄ±, iki kutbunu eÄip birbirine yaklaÅtÄ±rma Ã¶zlemiyle sanat yerine dÃ¼ÅÃ¼nceye baÅvuran Hesse, dÃ¼nyanÄ±n ve evrenin kutupluluÄu aÅarak ulaÅacaÄÄ± birliÄi kendisi iÃ§in en kutsal hakikat sayar.ÃldÃ¼rmeyeceksin, Hermann Hesseânin yazdÄ±ÄÄ± Ã§ok sayÄ±da denemeden yapÄ±lmÄ±Å bir seÃ§kiyi iÃ§eriyor; aÃ§Ä±k, samimi dÃ¼ÅÃ¼nceler ve doÄrudan bir dille kaleme alÄ±nmÄ±Å yazÄ±lar farklÄ± dÃ¶nemlerle farklÄ± temalarÄ± bir araya getiriyor. Kitap beÅ bÃ¶lÃ¼mden oluÅuyor: âErken DÃ¶nem DÃ¼ÅÃ¼ncelerâ, âBirinci DÃ¼nya SavaÅÄ±âna Dair Siyasi GÃ¶rÃ¼Ålerâ, âDÃ¼nya GÃ¶rÃ¼ÅÃ¼ne Dairâ, âEdebiyat YazÄ±larÄ±â, âGeÃ§ DÃ¶nem DÃ¼ÅÃ¼ncelerâ. Hermann Hesseânin duru edebiyatÄ±nÄ± bÃ¼yÃ¼k neÅeyle ve ilgiyle karÅÄ±layan okur iÃ§in âÃldÃ¼rmeyeceksinâ baÅlÄ±klÄ± SeÃ§me Denemeler gÃ¶rÃ¼ntÃ¼ bombardÄ±manÄ± ve bilgi kirliliÄi iÃ§inde yaÅadÄ±ÄÄ±mÄ±z Ã§aÄda dÃ¼ÅÃ¼nceleri sadeleÅtirmek adÄ±na iyi bir adÄ±m.","page_count":"0","author_name":"Hermann Hesse","id":1851996,"isbn":null,"title":"ÃldÃ¼rmeyeceksin","own_status":null},{"popularity":0,"published_year":"March 28th 1993","description":"=Small pleasures: Scattered and short prose from the legacy","page_count":"388","author_name":"Hermann Hesse","id":1660032,"isbn":"3518068601,9783518068601","title":"Kleine Freuden: Verstreute und kurze Prosa aus dem NachlaÃ","own_status":null},{"popularity":0,"published_year":"January 1st 1990","description":"Short novels: Beneath the Wheel / Knulp / L 'Klingsor's Last Summer / Klein and Wagner","page_count":"336","author_name":"Hermann Hesse","id":1656334,"isbn":null,"title":"Romanzi brevi: Sotto la ruota/Knulp/L'ultima estate di Klingsor/Klein e Wagner","own_status":null},{"popularity":4207,"published_year":"January 1st 1988","description":"Vowing at an early age âto be a poet or nothing at all,â Hermann Hesse rebelled against formal education, focusing on a rigorous program of independent study that included literature, philosophy, art, and history. One result of these efforts was a series of novels that became counterculture bibles that remain widely influential today. Another was a body of evocative spiritual poetry. Published for the first time in English, these vivid, probing short works reflect deeply on the challenges of life and provide a spiritual solace that transcends specific denominationalÂ hymns, prayers, and rituals.The Seasons of the Soul offers valuable guidance in poetic form for those longing for a more meaningful life, seeking a sense of homecoming in nature, in each stage of life, in a renewed relationship with the divine. Extensive quotations from his prose introduce each theme addressed in the book: love, imagination, nature, the divine, and the passage of time. A foreword by Andrew Harvey reintroduces us to a figure about whom some may have believedÂ everything had already been said. Thoughtful commentary throughout from translator Ludwig Max Fischer helps readers understand the poems within the context of Hesseâs life.From the Trade Paperback edition.","page_count":"133","author_name":"Hermann Hesse","id":1169196,"isbn":null,"title":"The Seasons of the Soul","own_status":null},{"popularity":0,"published_year":"November 1984","description":"=Kurgast/The Nuremberg travel. Two stories","page_count":"0","author_name":"Hermann Hesse","id":1154844,"isbn":null,"title":"Kurgast/Die NÃ¼rnberger Reise. Zwei ErzÃ¤hlungen","own_status":null},{"popularity":1197,"published_year":"1979","description":"Written during the same period as The Glass Bead Game, these poems reflect the book's mysticism and help to illuminate Hesse's physical and metaphysical search for a \"sublime alchemy\" that would go beyond all images","page_count":"89","author_name":"Hermann Hesse","id":1526860,"isbn":"0224017799,9780224017794","title":"Hours in the Garden and Other Poems","own_status":null},{"popularity":0,"published_year":"1978","description":null,"page_count":"155","author_name":"Hermann Hesse","id":1651929,"isbn":"0391009133,9780391009134","title":"Hermann Hesse \u0026 Romain Rolland: Correspondence, Diary Entries \u0026 Reflections 1915-40","own_status":null},{"popularity":0,"published_year":"1977","description":"=In the old sun","page_count":"56","author_name":"Hermann Hesse","id":707583,"isbn":"3150075572,9783150075579","title":"In der alten Sonne","own_status":null},{"popularity":136,"published_year":"1977","description":"E greu sa nu observi asemanarile cu Proust. Ãnsa modul de a cauta al lui  Hesse difera de cel al scriitorului francez. Ãn vreme ce Proust urmareste sa aduca la suprafata, din penumbra subconstientului, trairea ca atare, aparent fara insemnatate, Hesse recheama din intunericul trecutului, rinduieste si interpreteaza acele porniri care, aproape intotdeauna, sint adiacente componentei morale si care pun constiinta in fata dificultatii de a lua o decizie.  Friedrich Sieburg","page_count":"604","author_name":"Hermann Hesse","id":1940613,"isbn":null,"title":"Cele mai frumoase povestiri","own_status":null},{"popularity":108,"published_year":"September 5th 1976","description":null,"page_count":"0","author_name":"Hermann Hesse","id":1000267,"isbn":"351836782X,9783518367827","title":"Materialien zu Hermann Hesses Siddhartha 2. Text Ã¼ber Siddhartha","own_status":null},{"popularity":0,"published_year":"January 1st 1976","description":"Die zehn ErzÃ¤hlungen, die im Zeitraum eines halben Jahrhunderts entstanden, thematisieren in vielen Brechungen das zentrale Problem, dem sich fast alle Schriften Hermann Hesses widmeten: die unbehinderte Verwirklichung der jedermann eigenen und doch jeweils anders gearteten IndividualitÃ¤t.","page_count":"176","author_name":"Hermann Hesse","id":2172476,"isbn":"3150098327,9783150098325","title":"Das Nachtpfauenauge: AusgewÃ¤hlte ErzÃ¤hlungen","own_status":null},{"popularity":0,"published_year":"1975","description":"=Nuremberg Travel","page_count":"80","author_name":"Hermann Hesse","id":1172050,"isbn":"3518367277,9783518367278","title":"Die NÃ¼rnberger Reise","own_status":null},{"popularity":69,"published_year":"1973","description":"=Happiness. Late prose / Views","page_count":"264","author_name":"Hermann Hesse","id":1661188,"isbn":"3458341072,9783458341079","title":"GlÃ¼ck: Betrachtungen und Gedichte","own_status":null},{"popularity":2700,"published_year":"January 1st 1972","description":"IntroductionChildhood of the MagicianFrom My SchooldaysAbout GrandfatherLife Story Briefly ToldRemembrance of IndiaPidurutalagalaA Guest at the SpaJourney to NurembergOn Moving to a New HouseNotes on a Cure in BadenFor MarullaEvents in the Engadine","page_count":"0","author_name":"Hermann Hesse","id":737571,"isbn":"0330244191,9780330244190","title":"Autobiographical Writings","own_status":null},{"popularity":0,"published_year":"1971","description":"s/t: Gedanken aus seinen BÃ¼chern und Briefen","page_count":"0","author_name":"Hermann Hesse","id":706339,"isbn":"3518031945,9783518031940","title":"LektÃ¼re fÃ¼r Minuten","own_status":null},{"popularity":2696,"published_year":"January 1st 1971","description":"My Belief: Essays on Life and Art is a collection of essays by Hermann Hesse. The essays, written between 1904 and 1961, were originally published in German, either individually or in various collections between 1951 and 1973. This collection in English was first published in 1976, edited by Theodore Ziolkowski.","page_count":"0","author_name":"Hermann Hesse","id":610356,"isbn":"0586088970,9780586088975","title":"My Belief","own_status":null},{"popularity":319,"published_year":"1968","description":"The letters present two great XX century Nobel Prize writers grieving for the ruined world. In the 1930s and 1940s, they rail against the stupidity of war and the cowardice of diplomats, against the social savagery of the Nazis, against the blind forces of abstraction and nationalism. They brood about the fate of Germany and of Europe after the last shots have been fired. They have lived through a time of extraordinary horror and yet they have not surrendered to despair or nihilism. Reading the letters, the reader will feel like some privileged guest in a special room, sitting off to the side somewhere, listening while these men talk.","page_count":"232","author_name":"Hermann Hesse","id":774647,"isbn":"0974261556,9780974261553","title":"The Hesse/Mann Letters","own_status":null},{"popularity":766946,"published_year":"1955","description":"A collection of twenty-two fairy tales by the Nobel Prize-winning novelist, most translated into English for the first time, show the influence of German Romanticism, psychoanalysis, and Eastern religion on his development as an author.","page_count":"266","author_name":"Hermann Hesse","id":455661,"isbn":"0553377760,9780553377767","title":"The Fairy Tales of Hermann Hesse","own_status":null},{"popularity":5343,"published_year":"1954","description":"A collection of 23 short stories written during 1899-1948, 20 here translated for the first time:The Island Dream (1899)Incipit vita nova (1899)To Frau Gertrud (1899)November Night (1901)The Marble Workd (1904)The Latin Scholar (1906)The Wolf (1907)Walter Kompff (1908)The Field Devil (1908)Chagrin d'Amour (1908)A Man by the Name of Ziegler (1908)The Homecoming (1909)The City (1910)Robert Aghion (1913)The Cyclone (1913)From the Childhood of St. Francis of Assisi (1919)Inside and Outside (1920)Tragic (1923)Dream Journeys (1927)Harry, the Steppenwolf (1928)An Evening with Dr. Faust (1929)Edmund (1934)The Interrupted Class (1948)","page_count":"328","author_name":"Hermann Hesse","id":715173,"isbn":"089190669X,9780891906698","title":"Stories of Five Decades","own_status":null},{"popularity":15,"published_year":"January 1st 1954","description":null,"page_count":"88","author_name":"Hermann Hesse","id":1666378,"isbn":"3458084541,9783458084549","title":"Vom Baum Des Lebens. AusgewÃ¤hlte Gedichte","own_status":null},{"popularity":366,"published_year":"1952","description":"s/t: Betrachtungen und Gedichte Ã¼ber das Alter.\"Diesem Buch liegt eine CD bei, ein Auswahl aus der CD des HÃ¶rverlags: \u003E\u003EHermann Hesse. Zwischen Sommer und Herbst, Betrachtungen und heitere ErzÃ¤hlungen\u003C\u003C\"","page_count":"191","author_name":"Hermann Hesse","id":1791169,"isbn":"3518455516,9783518455517","title":"Mit der Reife wird man immer jÃ¼nger","own_status":null},{"popularity":15310,"published_year":"1946","description":"\"One of the most astonishing aspects of Hesse's career is the clear-sightedness and consistency of his political views, his passionate espousal of pacifism and internationism from the start of World War I to the end of his life. The earliest essay in this book was written in September, 1914 and was followed by a stream of letters, essays, and pamphlets that reached its hight point with \"Zarathustra's Return\" (published anonymously in 1919, the year that also saw the publication of 'Demian'), in which Hesse exhorted German youth to shake off the false gods of nationalism and militarism that had led their country into the abyss. Such views earned him the labels 'traitor' and 'viper' in Germany, but after World War II he was moved to reiterate his beliefs in another series of essays and letters. Hesse arranged his anti-war writings for publication in one volume in 1946; an amplified edition appeared 1n 1949 and that text has been followed for this first Engish language Edition.\"","page_count":"191","author_name":"Hermann Hesse","id":799873,"isbn":"0374509255,9780374509255","title":"If The War Goes On: Reflections On War And Politics","own_status":null},{"popularity":131,"published_year":"January 1st 1945","description":"Los relatos que aparecen en este libro resume la caracterÃ­Â­stica principal de toda obra de Hermann Hesse: una desgarrada, enternecida angustia por el destino del hombre. Leer EnsueÃ±os no sÃ³lo implica adentrarse en el pensamiento de Hesse, significa tambiÃ©n compartir su constante bÃºsqueda de las claves que permitan a la humanidad salir definitivamente las tinieblas para alcanzar, algÃºn dÃ­Â­a, su luminoso destino.","page_count":"0","author_name":"Hermann Hesse","id":632841,"isbn":"9681503813,9789681503819","title":"EnsueÃ±os","own_status":null},{"popularity":444,"published_year":"1938","description":"Lâ²infanzia del mago non Ã¨ tanto un frammento autobiografico di Hesse, quanto la sottile chiave di lettura che ci spiega la genesi profonda delle sue opere fondamentali, Siddharta come Il gioco delle perle di vetro. E la rievocazione di Hesse bambino che vuole diventare mago e anela ad essere invisibile, come il \"piccolo uomo\" che appare di tanto in tanto a dargli consigli e aiuto. ImparerÃ , alla fine, a diventare adulto, ma anche a \"sostituire lâ²invisibilitÃ  della cappa magica con lâ²invisibilitÃ  del sapiente che, mentre conosce, mai Ã¨ riconosciuto\".","page_count":"123","author_name":"Hermann Hesse","id":1937994,"isbn":"8872260191,9788872260197","title":"L'infanzia del mago","own_status":null},{"popularity":4220841,"published_year":"1932","description":"In simple, mesmerizing prose, Hermann Hesse's \"Journey to the East\" tells of a journey both geographic and spiritual. H.H., a German choirmaster, is invited on an expedition with the League, a secret society whose members include Paul Klee, Mozart, and Albertus Magnus. The participants traverse both space and time, encountering Noah's Ark in Zurich and Don Quixote at Bremgarten. The pilgrims' ultimate destination is the East, the \"Home of the Light,\" where they expect to find spiritual renewal. Yet the harmony that ruled at the outset of the trip soon degenerates into open conflict. Each traveler finds the rest of the group intolerable and heads off in his own direction, with H.H. bitterly blaming the others for the failure of the journey. It is only long after the trip, while poring over records in the League archives, that H.H. discovers his own role in the dissolution of the group, and the ominous significance of the journey itself.","page_count":"128","author_name":"Hermann Hesse","id":521444,"isbn":"0312421680,9780312421687","title":"The Journey to the East","own_status":null},{"popularity":35445647,"published_year":"1931","description":"\nThe final novel of Hermann Hesse, for which he won the Nobel Prize for Literature in 1946, The Glass Bead Game is a fascinating tale of the complexity of modern life as well as a classic of modern literatureSet in the 23rd century, The Glass Bead Game is the story of Joseph Knecht, who has been raised in Castalia, the remote place his society has provided for the intellectual elite to grow and flourish. Since childhood, Knecht has been consumed with mastering the Glass Bead Game, which requires a synthesis of aesthetics and scientific arts, such as mathematics, music, logic, and philosophy, which he achieves in adulthood, becoming a Magister Ludi (Master of the Game).","page_count":"558","author_name":"Hermann Hesse","id":473171,"isbn":"0312278497,9780312278496","title":"The Glass Bead Game","own_status":null},{"popularity":65748871,"published_year":"1930","description":"First published in 1930, Narcissus and Goldmund is the story of two diametrically opposite men: one, an ascetic monk firm in his religious commitment, and the other, a romantic youth hungry for worldly experience.Hesse was a great writer in precisely the modern sense: complex, subtle, allusive: alive to the importance of play. Narcissus and Goldmund is his very best. What makes this short book so limitlessly vast is the body-and-soul-shaking debate that runs through it, which it has the honesty and courage not to resolve: between the flesh and spirit, art and scientific or religious speculation, action and contemplation.","page_count":"315","author_name":"Hermann Hesse","id":390801,"isbn":"0374506841,9780374506841","title":"Narcissus and Goldmund","own_status":null},{"popularity":701,"published_year":"1929","description":"Old german script.","page_count":"0","author_name":"Hermann Hesse","id":712003,"isbn":null,"title":"Eine Bibliothek der Weltliteratur","own_status":null},{"popularity":333702568,"published_year":"1927","description":"\"Steppenwolf\" is a poetical self-portrait of a man who felt himself to be half-human and half-wolf. This Faust-like and magical story is evidence of Hesse's searching philosophy and extraordinary sense of humanity as he tells of the humanization of a middle-aged misanthrope. Yet this novel can also be seen as a plea for rigorous self-examination and an indictment of the intellectual hypocrisy of the period. As Hesse himself remarked, 'Of all my books \"Steppenwolf\" is the one that was more often and more violently misunderstood than any other'.","page_count":"256","author_name":"Hermann Hesse","id":390200,"isbn":"0140282580,9780140282580","title":"Steppenwolf","own_status":null},{"popularity":3854,"published_year":"1924","description":"Una pausa di due settimane nella vita di un intellettuale che aspira alla saggezza lo spinge â attraverso piccoli fatti in apparenza irrilevanti â a dubitare con buone ragioni di sÃ©: e quellâintellettuale Ã¨ Hesse stesso, che ironizza stupendamente sulla propria persona. Questo conflitto silenzioso, involontariamente comico ma non perciÃ² meno duro, si svolge entro la cornice antiquata di una stazione termale: su tale pretesto, Hesse ha costruito una delle sue piÃ¹ perfette parabole, La cura (1925), che segue di poco a Siddharta (1922) e in certo modo ne Ã¨ Â«lâaltra parteÂ». Come lÃ¬ si assisteva a un itinerario verso lâilluminazione, qui si âsmontaâ un illuminato occidentale troppo sicuro di sÃ©, che viene messo in crisi da piccoli incidenti quotidiani â e da ciÃ² Ã¨ condotto a rivedere certe sue convinzioni troppo tranquille. Ma il punto di arrivo Ã¨ lo stesso: in quella Â«psicologia dellâocchio cosmicoÂ» che Ã¨ il grande dono di Hesse e davanti alla quale Â«non câÃ¨ piÃ¹ nulla di piccolo, di sciocco, di brutto, di malvagio, ma tutto Ã¨ santo e venerabileÂ».","page_count":"143","author_name":"Hermann Hesse","id":821640,"isbn":"884590346X,9788845903465","title":"La cura","own_status":null},{"popularity":2433,"published_year":"1922","description":"\"Solo in questo consiste per me la vita, nel fluttuare tra due poli, nell'oscillazione tra i due pilastri portanti del mondo. vorrei con gioia far vedere sempre la beata varietÃ  del mondo e anche sempre ricordare che al fondo di questa varietÃ  vi Ã¨ un'unitÃ \". dopo il 1935 gli scritti di Hesse si richiamano spesso ad una delle concezioni piÃ¹ antiche dell'umanitÃ , la filosofia cinese dello yin e yang, forze opposte da cui scaturisce la tensione necessaria alla vita, alla trasformazione. una fiaba d'amore gaia e luminosa, attinta dalla saggezza del Siddharta, dove parola e disegno si fondono come uomo e donna, come sole e luna, a raccontare il paradiso del perenne rinnovamento.","page_count":"48","author_name":"Hermann Hesse","id":1151084,"isbn":"8872260124,9788872260128","title":"Favola d'amore","own_status":null},{"popularity":22180,"published_year":"1922","description":"Selected and with an Introduction by Theodore Ziolkowski.In the spring of 1922, several months after completing Siddhartha, Hermann Hesse wrote a fairy tale that was also a love story, inspired by the woman who was to become his second wife. That story, Pictor's Metamorphoses, is presented here along with a half century of Hesse's other short writings. Inspired by the Arabian Nights and the tales of the Brothers Grimm, these nineteen stories display the full range of Hesse's lifetime fascination with fantasy--as dream, fairy tale, folktale, satire, and allegory.","page_count":"240","author_name":"Hermann Hesse","id":1148285,"isbn":"0312422644,9780312422646","title":"Pictor's Metamorphoses and Other Fantasies","own_status":null},{"popularity":6065761494,"published_year":"1922","description":"In the novel, Siddhartha, a young man, leaves his family for a contemplative life, then, restless, discards it for one of the flesh. He conceives a son, but bored and sickened by lust and greed, moves on again. Near despair, Siddhartha comes to a river where he hears a unique sound. This sound signals the true beginning of his life -- the beginning of suffering, rejection, peace, and, finally, wisdom.","page_count":"152","author_name":"Hermann Hesse","id":390110,"isbn":"0553208845,9780553208849","title":"Siddhartha","own_status":null},{"popularity":83881,"published_year":"1920","description":"On May 2, 1919, Hesse wrote to Romain Rolland: \"I have had to bear a very heavy burden in my personal life in recent years. Now I am about to go to Ticino once again, to live for a while as a hermit in nature and in my work.\" In 1920, after settling in the Ticino mountain village of Montagnola, he published Wandering, a love letter to this magic-garden world that can be read as a meditation on his attempt to begin a new life. His pure prose, his heartfelt lyricism, and his love for the old earth, for its blessings that renew themselves, all sing in this serene book. The first German edition of Wandering included facsimiles of fourteen watercolor landscapes. Hesse's painting had blossomed in the southern countryside and he even toyed with the idea \"that I might still succeed in escaping literature entirely and making a living at the more appealing trade of painter.\" Unfortunately, his original pictures for Wandering have disappeared; this edition reproduces in black-and-white the full-color reproductions of the 1920 edition.","page_count":"109","author_name":"Hermann Hesse","id":605959,"isbn":"0224008048,9780224008044","title":"Wandering","own_status":null},{"popularity":129646128,"published_year":"1919","description":"Emil Sinclair is a young boy who was raised in a bourgeois home described as a Scheinwelt - a German wordplay meaning 'world of light' as well as 'world of illusion'. Through the novel, accompanied and prompted by his mysterious classmate Max Demian, Emil descends from and revolts against the superficial ideals of this world, eventually awakening into a realization of self.Though this is an earlier work, the style of Demian is pure Hesse. He quickly dramatizes moral and theological points, directly through the thoughts of the main character and his intense interaction with life teachers. Hesse's legacy is to economize by forming a drama which focuses entirely on direct, chthonic discovery that was shocking to early 20th century readers.","page_count":"177","author_name":"Hermann Hesse","id":1160441,"isbn":"3518067060,9783518367063","title":"Demian","own_status":null},{"popularity":29727,"published_year":"1919","description":"In 1919, the same year Demian was published, seven of these stories appeared as a book entitled MÃ¤rchen (lit. Fairy Tales). For this 1st edition in English, we have followed the arrangement Hesse made for the final collected edition of his works, where he added an 8th story, \"Flute Dream\".  The new note so clear in Demian was 1st sounded, Hesse believed, in some of these tales written during 1913-18, the period that brought him into conflict with supporters of the war, with his country \u0026 its government, with conventional intellectual life, with every form of orthodoxy both in the world \u0026 in himself. Unlike his earlier work, from Peter Carmenzind thru Knulp, the stories in Strange News from Another Star don't allow for an essentially realistic interpretaion. They are concerned with dream worlds, the subconscious, magical thinking \u0026 the numinous experience of the soul. Their subject is the distilling of wisdom.  The stories are \"Augustus\", \"The Poet\", \"Flute Dream\", \"Strange News from Another Star\", \"The Hard Passage\", \"A Dream Sequence\", \"Faldum\" \u0026--perhaps the masterpiece of the collection--\"Iris\".","page_count":"0","author_name":"Hermann Hesse","id":615125,"isbn":"0140181032,9780140181036","title":"Strange News from Another Star","own_status":null},{"popularity":6549,"published_year":"1919","description":"Friedrich Klein, der ehrbare Beamte, treusorgende Ehegatte und Familienvater, durchbricht plÃ¶tzlich, belastet mit einem imaginÃ¤ren Verbrechen, dem vierfachen Mord an Frau und Kindern, mit falschem PaÃ, einem Revolver und unterschlagenem Geld in der Tasche, seine hausbackene RespektabilitÃ¤t. Die Figur des Beamten Klein mit dem beziehungsreichen Decknamen Wagner ist eine erste Inkarnation von Hesses Steppenwolf.","page_count":"0","author_name":"Hermann Hesse","id":1147601,"isbn":"3518366165,9783518366165","title":"Klein und Wagner","own_status":null},{"popularity":124621,"published_year":"1919","description":"Written over the course of a few weeks in July and August 1919, it was published in December 1919 in the Deutsche Rundschau. It was later published (by Samuel Fischer) in a volume which included Kinderseele and Klein und Wagner. The story is an account of the final months of the life of Klingsor, a forty-two-year-old expressionist painter. A lover of poetry, a heavy drinker and a womanizer, he spends his final summer in southern Italy, torn between sensuality and spirituality and troubled by feelings of impending death.","page_count":"158","author_name":"Hermann Hesse","id":713227,"isbn":"345834098X,9783458340980","title":"Klingsors letzter Sommer","own_status":null},{"popularity":84,"published_year":"1919","description":"Sono qui raccolte le leggende e le fiabe scritte da Hermann Hesse nel periodo 1903-1932, gli anni piÃ¹ importanti della sua creativitÃ . Ritrovate tra carte ingiallite, alcune sono inedite, altre giÃ  pubblicate su riviste tedesche o svizzere quando l'autore era ancora in vita. Le leggende fiorite intorno ai Padri del Deserto e agli eremiti della Tebaide, il Medioevo francescano o quello cortese e cavalleresco, l'Italia rinascimentale e degli umanisti, rivivono in queste pagine in un clima mitico-simbolico soffuso di poesia. Nel vasto orizzonte tematico e geografico del grande scrittore tedesco non potevano mancare i riferimenti alla vita moderna, trasposti in una sorta di parabola satirica. Ai temi consueti della favolistica tradizionale (vita-morte, amore-odio) si aggiungono qui quelli della tentazione, della povertÃ , del miracolo, sempre trattati con garbo ispirato.","page_count":"438","author_name":"Hermann Hesse","id":1877036,"isbn":"8804458232,9788804458234","title":"Leggende e fiabe","own_status":null},{"popularity":1044,"published_year":"1918","description":"Als Hesse diese ErzÃ¤hlung schrieb, lagen die Begebenheiten, an die er sich hier erinnert, fast dreiÃig Jahre zurÃ¼ck. Die topographische ebenso wie die psychologische PrÃ¤zision des Geschilderten, die sich Ã¼ber Jahrzehnte hinweg unauslÃ¶schlich in allen Einzelheiten bewahrt hat, verrÃ¤t, wie einschneidend dieses Erlebnis gewesen sein muÃ, das sich am 11. November 1889 zugetragen hat.","page_count":"80","author_name":"Hermann Hesse","id":1153722,"isbn":"3518377035,9783518377031","title":"Kinderseele. ErzÃ¤hlung","own_status":null},{"popularity":404088,"published_year":"1915","description":"Hermann Karl Hesse (1877-1962), er schrieb auch unter den Pseudonym Emil Sinclair, war ein deutsch-schweizerischer Dichter, Schriftsteller und Freizeitmaler. 1895 begann Hesse eine BuchhÃ¤ndlerlehre in TÃ¼bingen. Ab 1895 arbeitete er in einer Buchhandlung in TÃ¼bingen. Noch als BuchhÃ¤ndler verÃ¶ffentlichte Hesse im Herbst 1898 seinen ersten kleinen Gedichtband Romantische Lieder und im Sommer 1899 die Prosasammlung Eine Stunde Hinter Mitternacht. Alsbald wurde der Roman Peter Camenzind, der 1904 regulÃ¤r bei Fischer erschien, einen Durchbruch. Von nun an konnte Hesse als freier Schriftsteller leben. Beim Ausbruch des Ersten Weltkrieges appellierte er an die deutschen Intellektuellen, nicht in nationalistische Polemik zu verfallen. 1919 Ã¼bersiedelte Hesse nach Montagnola, das Hesse Ã¼ber vierzig Jahre seines Lebens zur Heimstadt werden sollte. Der erfolgreichste Roman Hesses war Der Steppenwolf (1927). Ihm wurden unter anderem 1946 der Nobelpreis fÃ¼r Literatur und 1955 die Friedensklasse des Ordens Pour le MÃ©rite verliehen. Zu Hesses bekanntesten Werke gehÃ¶ren: Unterm Rad (1906), Demian (1919), Siddhartha (1922), NarziÃ und Goldmund (1930) und Das Glasperlenspiel (1943).","page_count":"0","author_name":"Hermann Hesse","id":1146759,"isbn":"3518380710,9783518380710","title":"Knulp","own_status":null},{"popularity":586832,"published_year":"1914","description":"Rosshalde is the classic story of a man torn between obligations to his family and his longing for a spiritual fulfillment that can only be found outside the confines of conventional society.Johann Veraguth, a wealthy, successful artist, is estranged from his wife and stifled by the unhappy union. Veraguthâs love for his young son and his fear of drifting rootlessly keep him bound within the walls of his opulent estate, Rosshalde. Yet, when he is shaken by an unexpected tragedy, Veraguth finally finds the courage to leave the desolate safety of Rosshalde and travels to India to discover himself anew.","page_count":"217","author_name":"Hermann Hesse","id":663517,"isbn":"9500725959,9789500725958","title":"Rosshalde","own_status":null},{"popularity":843522,"published_year":"1910","description":"With Gertrude, Herman Hesse continues his lifelong exploration of the irreconcilable elements of human existence. In this fictional memoir, the renowned composer Kuhn recounts his tangled relationships with two artists--his friend Heinrich Muoth, a brooding, self-destructive opera singer, and the gentle, self-assured Gertrude Imthor. Kuhn is drawn to Gertrude upon their first meeting, but Gertrude falls in love with Heinrich, to whom she is introduced when Kuhn auditions them for the leads in his new opera. Hopelessly ill-matched, Gertrude and Heinrich have a disastrous marriage that leaves them both ruined. Yet this tragic affair also becomes the inspiration for Kuhnâs opera, the most important success of his artistic life.","page_count":"256","author_name":"Hermann Hesse","id":703134,"isbn":"0312424639,9780312424633","title":"Gertrude","own_status":null},{"popularity":0,"published_year":"1910","description":"=Gertrud-Bella is the youthEdizione temporanea su licenza di Newton Compton, riunisce i seguenti racconti:Gertrud (Gertrud)Bella Ã¨ la gioventÃ¹ (SchÃ¶n ist die Jugend)Taedium Vitae (Taedium Vitae)Il Fidanzamento (Die Verlobung)Ladidel (Ladidel)","page_count":"317","author_name":"Hermann Hesse","id":1963123,"isbn":"8840368337,9788840368337","title":"Gertrud/Bella Ã¨ la gioventÃ¹","own_status":null},{"popularity":5095079,"published_year":"1906","description":"Hans Giebernath lives among the dull and respectable townsfolk of a sleepy Black Forest village. When he is discovered to be an exceptionally gifted student, the entire community presses him onto a path of serious scholarship. Hans dutifully follows the regimen of study and endless examinations, his success rewarded only with more crushing assignments. When Hans befriends a rebellious young poet, he begins to imagine other possibilities outside the narrowly circumscribed world of the academy. Finally sent home after a nervous breakdown, Hans is revived by nature and romance, and vows never to return to the gray conformity of the academic system.","page_count":"192","author_name":"Hermann Hesse","id":460225,"isbn":null,"title":"Beneath the Wheel","own_status":null},{"popularity":68,"published_year":"1906","description":"Questa raccolta comprende tre racconti ambientati in paesaggi suggestivi, dove impera la contemplazione di una natura bucolica e soleggiata. Lo stile Ã¨ sommesso, pacato, di una calma che sembra denotare la giovinezza dell'autore, che si ispira ad un romanticismo dolce e nostalgico; soprattutto la precocitÃ  degli scritti si nota in alcuni dialoghi, poco spontanei, e forse in una punta di presunzione da parte di Hermann Hesse, caratteristica certo di ogni autore alle prime armi.La ricerca stilistica non Ã¨ estenuante, come si puÃ² comprendere dalla presenza di termini ripetuti eccessivamente, o da una certa acerbitÃ  dei testi. Ma questi, che potrebbero essere solo difetti, diventano quasi dei pregi, perchÃ© ci mostrano un Hermann Hesse pieno di ardore giovanile, di passioni, di forti sentimenti che tramuta in sensazioni letterarie.","page_count":"96","author_name":"Hermann Hesse","id":2109148,"isbn":"8879830864,9788879830867","title":"Pellegrinaggio d'autunno","own_status":null},{"popularity":0,"published_year":"1905","description":"SÃ¤mtliche ErzÃ¤hlungen 1903-1905.Der zweite Band der SÃ¤mtlichen ErzÃ¤hlungen versammelt in chronologischer Folge die Geschichten, die Hesse neben den frÃ¼hen Romanen Peter Camenzind und Unterm Rad in seinem 26. bis 28. Lebensjahr geschrieben hat. Nur etwa die HÃ¤lfte davon findet sich in den von ihm selbst herausgegebenen ErzÃ¤hlbÃ¤nden, die anderen Schilderungen erschienen in Zeitungen und Zeitschriften. Erste Liebesgeschichten wie Hans Amstein, Die MarmorsÃ¤ge, Der LateinschÃ¼ler und Heumond stehen neben Erlebnisberichten von Hesses Schlosserlehre (1894/95) in seinem HeimatstÃ¤dtchen Calw.","page_count":"388","author_name":"Hermann Hesse","id":707579,"isbn":"3518458027,9783518458020","title":"Heumond: SÃ¤mtliche ErzÃ¤hlungen 1903-1905","own_status":null},{"popularity":0,"published_year":"1904","description":"Due racconti della giovinezza. Nel 1904, a soli 27 anni, Hesse raggiunse, con la pubblicazione di Peter Camenzin, un successo strepitoso: scritto con semplicita' ed eleganza, questo ritratto-autoritratto di un giovano sognatore e introverso che attraversa l'adolescenza giungendo alla cosiddetta maturita' con la consapevolezza di dover sacrificare qualche sogno e un po' di se stesso per il bene comune. Del 1919 e' invece Demian, libro assolutamente inaspettato, audace, che accese le fantasie delle giovani generazioni uscite dal conflitto mondiale e acconto trionfalmente dalla critica.","page_count":"252","author_name":"Hermann Hesse","id":1155947,"isbn":null,"title":"Peter Camenzind / Demian","own_status":null},{"popularity":1075800,"published_year":"1904","description":"Peter Camenzind, a young man from a Swiss mountain village, leaves his home and eagerly takes to the road in search of new experience. Traveling through Italy and France, Camenzind is increasingly disillusioned by the suffering he discovers around him; after failed romances and a tragic friendship, his idealism fades into crushing hopelessness. He finds peace again only when he cares for Boppi, an invalid who renews Camenzindâs love for humanity and inspires him once again to find joy in the smallest details of every life.","page_count":"208","author_name":"Hermann Hesse","id":615127,"isbn":"0312422636,9780312422639","title":"Peter Camenzind","own_status":null},{"popularity":247,"published_year":"1904","description":"Coloro che disdegnano di bere ad acque torbide, che non si appagano di simulacri, non si accontentano di un nome in luogo della sostanza, nÃ© di unâimmagine al posto della realtÃ , sono anche coloro che vogliono tornare alle prime sorgenti di ogni energia e di ogni vita: sono i grandi iniziati sulla via della saggezza. Tale emerge Francesco dâAssisi, in questa biografia di Hermann Hesse che si lega straordinariamente alla futura problematica e alle figure iniziatiche che tanta parte hanno nellâarte di questo scrittore.","page_count":"91","author_name":"Hermann Hesse","id":792554,"isbn":null,"title":"Francesco d'Assisi","own_status":null},{"popularity":267,"published_year":"1389","description":"Throughout his life, Herman Hesse was a devoted letter writer. He corresponded, not just with friends and family, but also with his readers. From his letters home from the seminary at age fourteen, to his last letters, written days before his death at eighty-five, this selection gives a sense of the author of some of the most widely read books of the century.","page_count":"347","author_name":"Hermann Hesse","id":775177,"isbn":"0374126127,9780374126124","title":"Soul of the Age: Selected Letters, 1891-1962","own_status":null}],"users":[{"first_name":null,"image_url":null,"selectedMonth":null,"id":null,"last_name":null,"init_book_read_count":null,"about":null,"selectedYear":null,"selectedDay":null,"gender":null}],"status":null,"website_url":null,"facebook_url":null,"twitter_handle":null};
        return data;
    }

    this.get_book_details = function(){
        var data = {
            book_id: 391747,
            isbn: "0307269752,9780307269751",
            title: "The Girl with the Dragon Tattoo",
            author_name: "Stieg Larsson",
            page_count: "465",
            published_year: "2005",
            popularity_index: 6.7,
            goodness_index: 7.2,
            likeability_index: 7.3,
            book_reader_relationship_index: 6.1,
            popularity: 228536714734,
            label: [
                "Book",
                "ActiveBook",
                "Contemporary"
            ],
            description: "Mikael Blomkvist, a once-respected financial journalist, watches his professional life rapidly crumble around him. Prospects appear bleak until an unexpected (and unsettling) offer to resurrect his name is extended by an old-school titan of Swedish industry. The catchâand there's always a catchâis that Blomkvist must first spend a year researching a mysterious disappearance that has remained unsolved for nearly four decades. With few other options, he accepts and enlists the help of investigator Lisbeth Salander, a misunderstood genius with a cache of authority issues. Little is as it seems in Larsson's novel, but there is at least one constant: you really don't want to mess with the girl with the dragon tattoo.",
            author_id: 391748
        };
        return data;
    }

    this.get_bookmarks = function(){
        var bookmarks = [
            {
                label_name: "Read",
                label_id: 2617554,
                public_status: true,
                label_key: "Read",
                status: null
            },
            {
                label_name: "Not worth reading",
                label_id: 2617689,
                public_status: true,
                label_key: "NotWorthReading",
                status: null
            },
            {
                label_name: "Have left a mark on me",
                label_id: 2617688,
                public_status: true,
                label_key: "HaveLeftAMarkOnMe",
                status: null
            },
            {
                label_name: "Intending to read",
                label_id: 2617555,
                public_status: true,
                label_key: "IntendingToRead",
                status: null
            },
            {
                label_name: "Currently reading",
                label_id: 2617643,
                public_status: true,
                label_key: "CurrentlyReading",
                status: null
            }
        ]
        return bookmarks;
    }

    this.get_rooms = function(){
        var data = [
            {
                "name" : "Social Psychology",
                "id": 4998086,
                "view_count": 100
            },
            {
                "name" : "Comic Book Superhero",
                "id": 5017968,
                "view_count": 100
            },
            {
                "name" : "Political Philosophy",
                "id": 4972796,
                "view_count": 100
            },
            {
                "name" : "Sports",
                "id": 5024590,
                "view_count": 100
            },
            {
                "name" : "Brain",
                "id": 4988942,
                "view_count": 100
            },
            {
                "name" : "Religion",
                "id": 5023062,
                "view_count": 100
            },
            {
                "name" : "Technology",
                "id": 5021552,
                "view_count": 100
            },
            {
                "name" : "Health",
                "id": 5020478,
                "view_count": 100
            },
            {
                "name" : "Blanching(Cooking)",
                "id": 5107299,
                "view_count": 100
            },
            {
                "name" : "Medicine",
                "id": 5020467,
                "view_count": 100
            },
            {
                "name" : "Pornography Ring",
                "id": 5002021,
                "view_count": 100
            },
            {
                "name" : "Ghost",
                "id": 5014454,
                "view_count": 100
            },
            {
                "name" : "Adorable Selfie",
                "id": 4996889,
                "view_count": 100
            },
            {
                "name" : "Travel",
                "id": 4980414,
                "view_count": 100
            },
            {
                "name" : "Walt Disney Co",
                "id": 5100214,
                "view_count": 100
            },
            {
                "name" : "Biology",
                "id": 5023104,
                "view_count": 100
            },
            {
                "name" : "Quantum Gravity",
                "id": 5013921,
                "view_count": 100
            },
            {
                "name" : "Time",
                "id": 4980633,
                "view_count": 100
            },
            {
                "name" : "Space",
                "id": 4975850,
                "view_count": 100
            }
        ];
        return data;
    }

    this.get_popular_books = function(){
        var data = [{
            "book_id":395152,
            "isbn":"0439023483,9780439023481",
            "title":"The Hunger Games",
            "author_name":"Suzanne Collins",
            "page_count":"374",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":null,
            "label":["Book","ActiveBook"],
            "bookmark_count":46,
            "description":"Winning will make you famous. Losing means certain death.In a dark vision of the near future, a terrifying reality TV show is taking place. Twelve boys and twelve girls are forced to appear in a live event called the Hunger Games. There is only one rule: kill or be killed.When sixteen-year-old Katniss Everdeen steps forward to take her sister's place in the games, she sees it as a death sentence. But Katniss has been close to death before. For her, survival is second nature.",
            "external_thumb":null,
            "bookmark_node":[{"status":5245859,"bookmarked_by":null,"created_at":1436959689},{"status":5245859,"bookmarked_by":null,"created_at":1436959689},{"status":5245859,"bookmarked_by":null,"created_at":1436959689},{"status":5245859,"bookmarked_by":null,"created_at":1436959689},{"status":5245859,"bookmarked_by":null,"created_at":1436959689},{"status":5245859,"bookmarked_by":null,"created_at":1436959689},{"status":5245859,"bookmarked_by":null,"created_at":1436959689},{"status":5245858,"bookmarked_by":null,"created_at":1436959688},{"status":5245858,"bookmarked_by":null,"created_at":1436959688},{"status":5245858,"bookmarked_by":null,"created_at":1436959688},{"status":5245858,"bookmarked_by":null,"created_at":1436959688},{"status":5245858,"bookmarked_by":null,"created_at":1436959688},{"status":5245858,"bookmarked_by":null,"created_at":1436959688},{"status":5245858,"bookmarked_by":null,"created_at":1436959688},{"status":5245857,"bookmarked_by":null,"created_at":1436959686},{"status":5245857,"bookmarked_by":null,"created_at":1436959686},{"status":5245857,"bookmarked_by":null,"created_at":1436959686},{"status":5245857,"bookmarked_by":null,"created_at":1436959686},{"status":5245857,"bookmarked_by":null,"created_at":1436959686},{"status":5245857,"bookmarked_by":null,"created_at":1436959686},{"status":5245857,"bookmarked_by":null,"created_at":1436959686},{"status":5115233,"bookmarked_by":null,"created_at":1436503307},{"status":5115233,"bookmarked_by":null,"created_at":1436503307},{"status":5115233,"bookmarked_by":null,"created_at":1436503307},{"status":5115233,"bookmarked_by":null,"created_at":1436503307},{"status":5115233,"bookmarked_by":null,"created_at":1436503307},{"status":5115233,"bookmarked_by":null,"created_at":1436503307},{"status":5115233,"bookmarked_by":null,"created_at":1436503307},{"status":5115232,"bookmarked_by":null,"created_at":1436503302},{"status":5115232,"bookmarked_by":null,"created_at":1436503302},{"status":5115232,"bookmarked_by":null,"created_at":1436503302},{"status":5115232,"bookmarked_by":null,"created_at":1436503302},{"status":5115232,"bookmarked_by":null,"created_at":1436503302},{"status":5115232,"bookmarked_by":null,"created_at":1436503302},{"status":5115232,"bookmarked_by":null,"created_at":1436503302},{"status":5000438,"bookmarked_by":null,"created_at":1433506961},{"status":5000438,"bookmarked_by":null,"created_at":1433506961},{"status":5000438,"bookmarked_by":null,"created_at":1433506961},{"status":5000438,"bookmarked_by":null,"created_at":1433506961},{"status":5000438,"bookmarked_by":null,"created_at":1433506961},{"status":5000438,"bookmarked_by":null,"created_at":1433506961},{"status":5000438,"bookmarked_by":null,"created_at":1433506961}],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":"Teens","uuid":28,"icon":null,"aws_key":"teens.jpg","id":2586580},{"name":"Science Fiction \u0026 Fantasy","uuid":26,"icon":null,"aws_key":"science_fiction.jpg","id":2584683},{"name":"Literature \u0026 Fiction","uuid":16,"icon":null,"aws_key":"literature.jpg","id":2581101},{"name":"Outdoors \u0026 Nature","uuid":18,"icon":null,"aws_key":"nature.jpg","id":2587657}]},{
            "book_id":390027,
            "isbn":"0061120081,9780061120084",
            "title":"To Kill a Mockingbird",
            "author_name":"Harper Lee",
            "page_count":"324",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":"1960",
            "label":["Book","ActiveBook","PostModernLiterature"],
            "bookmark_count":35,
            "description":"\"You never really understand a person until you consider things from his point of view .. until you climb into his skin and walk around in it.\" Tomboy Scout Finch comes of age in a small Alabama town during a crisis in 1935. She admires her father Atticus, how he deals with issues of racism, injustice, intolerance and bigotry, his courage and his love.",
            "external_thumb":null,
            "bookmark_node":[{"status":5249741,"bookmarked_by":null,"created_at":1437236236},{"status":5249741,"bookmarked_by":null,"created_at":1437236236},{"status":5249741,"bookmarked_by":null,"created_at":1437236236},{"status":5243402,"bookmarked_by":null,"created_at":1436683640},{"status":5243402,"bookmarked_by":null,"created_at":1436683640},{"status":5243402,"bookmarked_by":null,"created_at":1436683640},{"status":4977313,"bookmarked_by":null,"created_at":1431442752},{"status":4977313,"bookmarked_by":null,"created_at":1431442752},{"status":4977313,"bookmarked_by":null,"created_at":1431442752}],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":"Literature \u0026 Fiction","uuid":16,"icon":null,"aws_key":"literature.jpg","id":2581101},{"name":"Mystery \u0026 Thrillers","uuid":17,"icon":null,"aws_key":"mystery.jpg","id":2587221}]},{
            "book_id":391747,
            "isbn":"0307269752,9780307269751",
            "title":"The Girl with the Dragon Tattoo",
            "author_name":"Stieg Larsson",
            "page_count":"465",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":"2005",
            "label":["Book","ActiveBook","Contemporary"],
            "bookmark_count":30,
            "description":"Mikael Blomkvist, a once-respected financial journalist, watches his professional life rapidly crumble around him. Prospects appear bleak until an unexpected (and unsettling) offer to resurrect his name is extended by an old-school titan of Swedish industry. The catchâand there's always a catchâis that Blomkvist must first spend a year researching a mysterious disappearance that has remained unsolved for nearly four decades. With few other options, he accepts and enlists the help of investigator Lisbeth Salander, a misunderstood genius with a cache of authority issues. Little is as it seems in Larsson's novel, but there is at least one constant: you really don't want to mess with the girl with the dragon tattoo.",
            "external_thumb":null,
            "bookmark_node":[{"status":5128544,"bookmarked_by":null,"created_at":1436542825}],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":null,"uuid":null,"icon":null,"aws_key":null,"id":null}]},{
            "book_id":385359,
            "isbn":"0439023513,9780439023511",
            "title":"Mockingjay",
            "author_name":"Suzanne Collins",
            "page_count":"390",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":null,
            "label":["Book","ActiveBook"],
            "bookmark_count":10,
            "description":"My name is Katniss Everdeen.Why am I not dead?I should be dead.Katniss Everdeen, girl on fire, has survived, even though her home has been destroyed.  Gale has escaped. Katniss's family is safe. Peeta has been captured by the Capitol. District 13 really does exist. There are rebels. There are new leaders. A revolution is unfolding.It is by design that Katniss was rescued from the arena in the cruel and haunting Quarter Quell, and it is by design that she has long been part of the revolution without knowing it.  District 13 has come out of the shadows and is plotting to overthrow the Capitol. Everyone, it seems, has had a hand in the carefully laid plans--except Katniss.The success of the rebellion hinges on Katniss's willingness to be a pawn, to accept responsibility for countless lives, and to change the course of the future of Panem. To do this, she must put aside her feelings of anger and distrust. She must become the rebels' Mockingjay--no matter what the personal cost.",
            "external_thumb":null,
            "bookmark_node":[],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":"Outdoors \u0026 Nature","uuid":18,"icon":null,"aws_key":"nature.jpg","id":2587657},{"name":"Science Fiction \u0026 Fantasy","uuid":26,"icon":null,"aws_key":"science_fiction.jpg","id":2584683},{"name":"Teens","uuid":28,"icon":null,"aws_key":"teens.jpg","id":2586580}]},{
            "book_id":395234,
            "isbn":"0439023491,9780439023498",
            "title":"Catching Fire",
            "author_name":"Suzanne Collins",
            "page_count":"391",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":"2009",
            "label":["Book","ActiveBook","Contemporary"],
            "bookmark_count":38,
            "description":"Sparks are igniting.Flames are spreading.And the Capitol wants revenge.Against all odds, Katniss has won the Hunger Games.  She and fellow District 12 tribute Peeta Mellark are miraculously still alive.  Katniss should be relieved, happy even.  After all, she has returned to her family and her longtime friend, Gale.  Yet nothing is the way Katniss wishes it to be.  Gale holds her at an icy distance.  Peeta has turned his back on her completely.  And there are whispers of a rebellion against the Capitol - a rebellion that Katniss and Peeta may have helped create.Much to her shock, Katniss has fueled an unrest she's afraid she cannot stop.  And what scares her even more is that she's not entirely convinced she should try.  As time draws near for Katniss and Peeta to visit the districts on the Capitol's cruel Victory Tour, the stakes are higher than ever.  If they can't prove, without a shadow of a doubt, that they are lost in their love for each other, the consequences will be horrifying.In Catching Fire, the second novel in the Hunger Games trilogy, Suzanne Collins continues the story of Katniss Everdeen, testing her more than ever before...and surprising readers at every turn.",
            "external_thumb":null,
            "bookmark_node":[{"status":5000444,"bookmarked_by":null,"created_at":1433509241},{"status":5000444,"bookmarked_by":null,"created_at":1433509241},{"status":5000444,"bookmarked_by":null,"created_at":1433509241},{"status":5000444,"bookmarked_by":null,"created_at":1433509241},{"status":5000444,"bookmarked_by":null,"created_at":1433509241},{"status":5000444,"bookmarked_by":null,"created_at":1433509241},{"status":5000443,"bookmarked_by":null,"created_at":1433508618},{"status":5000443,"bookmarked_by":null,"created_at":1433508618},{"status":5000443,"bookmarked_by":null,"created_at":1433508618},{"status":5000443,"bookmarked_by":null,"created_at":1433508618},{"status":5000443,"bookmarked_by":null,"created_at":1433508618},{"status":5000443,"bookmarked_by":null,"created_at":1433508618}],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":"Science Fiction \u0026 Fantasy","uuid":26,"icon":null,"aws_key":"science_fiction.jpg","id":2584683},{"name":"Romance","uuid":24,"icon":null,"aws_key":"romance.jpg","id":2585868},{"name":"Teens","uuid":28,"icon":null,"aws_key":"teens.jpg","id":2586580},{"name":"Outdoors \u0026 Nature","uuid":18,"icon":null,"aws_key":"nature.jpg","id":2587657}]},{
            "book_id":1171519,
            "isbn":null,
            "title":"Harry Potter and the Philosopher's Stone",
            "author_name":"J.K. Rowling",
            "page_count":"226",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":null,
            "label":["Book","ActiveBook"],
            "bookmark_count":22,
            "description":"Harry Potter has never played a sport while flying on a broomstick. He's never worn a cloak of invisibility, befriended a giant, or helped hatch a dragon. All Harry knows is a miserable life with the Dursleys, his horrible aunt and uncle, and their abominable son, Dudley. Harry's room is a tiny closet at the foot of the stairs, and he hasn't had a birthday party in eleven years. But all that is about to change when a mysterious letter arrives by owl messenger: a letter with an invitation to a wonderful place he never dreamed existed. There he finds not only friends, aerial sports, and magic around every corner, but a great destiny that's been waiting for him...if Harry can survive the encounter. Rescued from the outrageous neglect of his aunt and uncle, a young boy with a great destiny proves his worth while attending Hogwarts School for Witchcraft and Wizardry.",
            "external_thumb":null,
            "bookmark_node":[],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":null,"uuid":null,"icon":null,"aws_key":null,"id":null}]},{
            "book_id":390053,
            "isbn":"0439554934,9780439554930",
            "title":"Harry Potter and the Sorcerer's Stone",
            "author_name":"J.K. Rowling",
            "page_count":"310",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":"June 26th 1997",
            "label":["Book","ActiveBook","PostModernLiterature"],
            "bookmark_count":31,
            "description":"Harry Potter has never played a sport while flying on a broomstick. He's never worn a Cloak of Invisibility, befriended a giant, or helped hatch a dragon. All Harry knows is a miserable life with the Dursleys, his horrible aunt and uncle, and their abominable son, Dudley. Harry's room is a tiny cupboard under the stairs, and he hasn't had a birthday party in ten years.But all that is about to change when a mysterious letter arrives by owl messenger: a letter with an invitation to a wonderful place he never dreamed existed. There he finds not only friends, aerial sports, and magic around every corner, but a great destiny that's been waiting for him... if Harry can survive the encounter.",
            "external_thumb":null,
            "bookmark_node":[{"status":5112131,"bookmarked_by":null,"created_at":1436008408}],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":null,"uuid":null,"icon":null,"aws_key":null,"id":null}]},{
            "book_id":395616,
            "isbn":"0525478817,9780525478812",
            "title":"The Fault in Our Stars",
            "author_name":"John Green",
            "page_count":"318",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":null,
            "label":["Book","ActiveBook"],
            "bookmark_count":40,
            "description":"Despite the tumor-shrinking medical miracle that has bought her a few years, Hazel has never been anything but terminal, her final chapter inscribed upon diagnosis. But when a gorgeous plot twist named Augustus Waters suddenly appears at Cancer Kid Support Group, Hazel's story is about to be completely rewritten.",
            "external_thumb":null,
            "bookmark_node":[],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":null,"uuid":null,"icon":null,"aws_key":null,"id":null}]},{
            "book_id":390350,
            "isbn":"0399155341,9780399155345",
            "title":"The Help",
            "author_name":"Kathryn Stockett",
            "page_count":"451",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":null,
            "label":["Book","ActiveBook"],
            "bookmark_count":7,
            "description":"Three ordinary women are about to take one extraordinary step.Twenty-two-year-old Skeeter has just returned home after graduating from Ole Miss. She may have a degree, but it is 1962, Mississippi, and her mother will not be happy till Skeeter has a ring on her finger. Skeeter would normally find solace with her beloved maid Constantine, the woman who raised her, but Constantine has disappeared and no one will tell Skeeter where she has gone.Aibileen is a black maid, a wise, regal woman raising her seventeenth white child. Something has shifted inside her after the loss of her own son, who died while his bosses looked the other way. She is devoted to the little girl she looks after, though she knows both their hearts may be broken.Minny, Aibileen's best friend, is short, fat, and perhaps the sassiest woman in Mississippi. She can cook like nobody's business, but she can't mind her tongue, so she's lost yet another job. Minny finally finds a position working for someone too new to town to know her reputation. But her new boss has secrets of her own.Seemingly as different from one another as can be, these women will nonetheless come together for a clandestine project that will put them all at risk. And why? Because they are suffocating within the lines that define their town and their times. And sometimes lines are made to be crossed.In pitch-perfect voices, Kathryn Stockett creates three extraordinary women whose determination to start a movement of their own forever changes a town, and the way women - mothers, daughters, caregivers, friends - view one another. A deeply moving novel filled with poignancy, humor, and hope, The Help is a timeless and universal story about the lines we abide by, and the ones we don't.",
            "external_thumb":null,
            "bookmark_node":[],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":"Literature \u0026 Fiction","uuid":16,"icon":null,"aws_key":"literature.jpg","id":2581101},{"name":"History","uuid":12,"icon":null,"aws_key":"history.jpg","id":2590333}]},{
            "book_id":392439,
            "isbn":"0062024035,9780062024039",
            "title":"Divergent",
            "author_name":"Veronica Roth",
            "page_count":"487",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":"2011",
            "label":["Book","ActiveBook","Contemporary"],
            "bookmark_count":8,
            "description":"In Beatrice Prior's dystopian Chicago world, society is divided into five factions, each dedicated to the cultivation of a particular virtue--Candor (the honest), Abnegation (the selfless), Dauntless (the brave), Amity (the peaceful), and Erudite (the intelligent). On an appointed day of every year, all sixteen-year-olds must select the faction to which they will devote the rest of their lives. For Beatrice, the decision is between staying with her family and being who she really is--she can't have both. So she makes a choice that surprises everyone, including herself.During the highly competitive initiation that follows, Beatrice renames herself Tris and struggles alongside her fellow initiates to live out the choice they have made. Together they must undergo extreme physical tests of endurance and intense psychological simulations, some with devastating consequences. As initiation transforms them all, Tris must determine who her friends really are--and where, exactly, a romance with a sometimes fascinating, sometimes exasperating boy fits into the life she's chosen. But Tris also has a secret, one she's kept hidden from everyone because she's been warned it can mean death. And as she discovers unrest and growing conflict that threaten to unravel her seemingly perfect society, Tris also learns that her secret might help her save the ones she loves . . . or it might destroy her.",
            "external_thumb":null,
            "bookmark_node":[{"status":5112130,"bookmarked_by":null,"created_at":1436007703}],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":null,"uuid":null,"icon":null,"aws_key":null,"id":null}]},{
            "book_id":1600701,
            "isbn":null,
            "title":"ÐÐµÐ²ÑÑÐºÐ° Ñ ÑÐ°ÑÑÐ¸ÑÐ¾Ð²ÐºÐ¾Ð¹ Ð´ÑÐ°ÐºÐ¾Ð½Ð°",
            "author_name":"Stieg Larsson",
            "page_count":"624",
            "goodness_index": 7.2,
            "book_reader_relationship_index": 8.0,
            "likeability_index": 8.1,
            "popularity_index": 6.1,
            "published_year":"2005",
            "label":["Book","ActiveBook","Contemporary"],
            "bookmark_count":"0",
            "description":"",
            "external_thumb":null,
            "bookmark_node":[],
            "rating_node":{"rating":null,"rated_book_id":null,"rated_by":null,"rated_on":null},
            "root_category":[{"name":null,"uuid":null,"icon":null,"aws_key":null,"id":null}]}];
        return data;
    }

    this.get_personal_feed = function(){
        var data = [
            {
                label: "StatusNode",
                created_at: 1436957699,
                data: {
                    feed: {
                        id: "5245852"
                    },
                    content: "Testing reload functionality."
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436953096,
                data: {
                   feed: {
                        id: "5245850"
                    },
                    community: {
                        id: 4976756,
                        name: "Singapore"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436891020,
                data: {
                    feed: {
                        id: "5245062"
                    },
                    community: {
                        id: 5244964,
                        name: "Pluto"
                    }
                }
            },
            {
                label: "RatingNode",
                created_at: 1436856497,
                data: {
                    feed: {
                        id: "5244155",
                        rating: 3
                    },
                    book: {
                        id: 390053,
                        title: "Harry Potter and the Sorcerer's Stone"
                    },
                    author: {
                        id: 390054,
                        name: "J. K. Rowling"
                    }
                }
            },
            {
                label: "EndorseNode",
                created_at: 1436631310,
                data: {
                    feed: {
                       id: "5242627"
                    },
                    book: {
                        id: 390265,
                        title: "The Book Thief"
                    },
                    author: {
                        id: 5118397,
                        name: "Markus Zusak"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436631141,
                data: {
                    feed: {
                       id: "5242626"
                    },
                    community: {
                        id: 5021274,
                        name: "Apple Inc."
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436630823,
                data: {
                    feed: {
                        id: "5242621"
                    },
                    friend: {
                        id: 4986324,
                        name: "Bhuwan Arora"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436630789,
                data: {
                    feed: {
                        id: "5242620"
                    },
                    community: {
                        id: 5007924,
                        name: "Oculus Rift"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436530134,
                data: {
                    feed: {
                        id: "5115984"
                    },
                    community: {
                        id: 5024989,
                        name: "SpaceX"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436445660,
                data: {
                    feed: {
                        id: "5115224"
                    },
                    friend: {
                        id: 4960099,
                        name: "Niraj Singh"
                    }
                }
            },
            {
                label: "StatusNode",
                created_at: 1436372461,
                data: {
                    feed: {
                        id: "5114500"
                    },
                    content: "test"
                }
            }
        ];
        return data;
    }

    this.get_social_feed = function(){
        var data = [
            {
                label: "FollowsNode",
                created_at: 1437400555,
                data: {
                    feed: {
                        id: "5250421"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    community: {
                        id: 4978625,
                        name: "Machine press"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1437399853,
                data: {
                    feed: {
                        id: "5250419"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    community: {
                        id: 4982924,
                        name: "Territorial disputes of China"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1437386045,
                data: {
                    feed: {
                        id: "5250409"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    community: {
                        id: 4977692,
                        name: "Team sports"
                    }
                }
            },
            {
                label: "BookmarkNode",
                created_at: 1437236236,
                data: {
                    feed: {
                        id: "5249741",
                        key: "Read"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    book: {
                        id: 390027,
                        title: "To Kill a Mockingbird"
                    },
                    author: {
                        id: 3709741,
                        name: "Harper Lee"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1437137889,
                data: {
                    feed: {
                        id: "5248285"
                    },
                    user: {
                        id: 4986324,
                        name: "Bhuwan Arora",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/p200x200/66784_415130785223231_1615890777_n.jpg?oh=b5d38fc55d843df4b3208036c79889f1&oe=56572F17&__gda__=1444457657_b4ec8085de3d6a82d7f6a51debe0ffa7"
                    },
                    author: {
                        id: 4975556,
                        name: null
                    }
                }
            },
            {
                label: "BookmarkNode",
                created_at: 1436959372,
                data: {
                    feed: {
                        id: "5245856",
                        key: "IntendingToRead"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    book: {
                        id: 453570,
                        title: "Light My Fire"
                    },
                    author: {
                        id: 407555,
                        name: "Katie MacAlister"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436959362,
                data: {
                    feed: {
                        id: "5245854"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    community: {
                        id: 5104533,
                        name: "Fifty Shades of Grey"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436854860,
                data: {
                    feed: {
                        id: "5244150"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    friend: {
                        id: 4960099,
                        name: "Niraj Singh"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436854811,
                data: {
                    feed: {
                        id: "5244149"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    friend: {
                        id: 4084079,
                        name: "Bhuwan Arora"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436854808,
                data: {
                    feed: {
                        id: "5244148"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    friend: {
                        id: 4986324,
                        name: "Bhuwan Arora"
                    }
                }
            },
            {
                label: "FollowsNode",
                created_at: 1436854799,
                data: {
                    feed: {
                        id: "5244147"
                    },
                    user: {
                        id: 4974698,
                        name: "Ashesh Mishra",
                        thumb: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xft1/v/t1.0-1/p200x200/11173310_1434123490237046_772909581382978016_n.jpg?oh=18daefeacb003bb2289e720f459d61e1&oe=561926AE&__gda__=1443778791_0645658d6c1d1c9bb22e65629ff3a041"
                    },
                    friend: {
                        id: 4105710,
                        name: "Prachi Jain"
                    }
                }
            }
        ];
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
                "most_important_tag":[
                    {
                        "image_url": "http://www.lf.k12.de.us/wp-content/uploads/2015/03/Sports.png",
                        "name":"Sports",
                        "view_count":67,
                        "users":[
                            {
                                "first_name":null,
                                "image_url":null,
                                "selectedMonth":null,
                                "id":4543516,
                                "last_name":null,
                                "init_book_read_count":null,
                                "about":null,
                                "selectedYear":null,
                                "selectedDay":null,
                                "gender":null
                            },
                            {
                                "first_name":"Prachi",
                                "image_url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xat1/v/t1.0-1/p200x200/11219323_650602008372756_6765256980039484173_n.jpg?oh=406c6a1a65a03e040d8dff53bce54dfe\u0026oe=567A03A7\u0026__gda__=1447240064_deb583e115d69f88598844f825f903b8",
                                "selectedMonth":null,
                                "id":5014392,
                                "last_name":"Jain",
                                "init_book_read_count":"100-250",
                                "about":null,
                                "selectedYear":null,
                                "selectedDay":null,
                                "gender":"Female"
                            },
                            {
                                "first_name":"Bhuwan",
                                "image_url":"https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xpa1/v/t1.0-1/p200x200/11822486_855071294562509_8449814269949540302_n.jpg?oh=ecd7b10ca1c6cf5bc7d330c99835854e\u0026oe=56454A72\u0026__gda__=1446428879_6ab07f79060833d340b4d2b888a64148",
                                "selectedMonth":"Dec",
                                "id":4084079,
                                "last_name":"Arora",
                                "init_book_read_count":"50-100",
                                "about":"Liberal",
                                "selectedYear":1989,
                                "selectedDay":1,
                                "gender":"Male"
                            }
                        ],
                        "id":5024590,
                        "books":[
                            {
                                "popularity":32759,
                                "published_year":"2010",
                                "page_count":"224",
                                "author_name":"Rick Reilly",
                                "id":677136,
                                "isbn":null,
                                "popularity_index":7.6,
                                "book_reader_relationship_index":4.5,
                                "goodness_index":5.6,
                                "likeability_index":7.8,
                                "title":"Sports from Hell: My Search for the World's Dumbest Competition"
                            },
                            {
                                "popularity":41,
                                "published_year":"July 16th 2010",
                                "page_count":"334",
                                "author_name":"Leif H. Smith",
                                "id":1977711,
                                "isbn":null,
                                "popularity_index":7.6,
                                "book_reader_relationship_index":4.5,
                                "goodness_index":5.6,
                                "likeability_index":7.8,
                                "title":"Sports Psychology For Dummies"
                            },
                            {
                                "popularity":9,
                                "published_year":"November 1988",
                                "page_count":"280",
                                "author_name":"Thomas Fensch",
                                "id":1564940,
                                "isbn":"0805815287, 9780805815283",
                                "popularity_index":7.6,
                                "book_reader_relationship_index":4.5,
                                "goodness_index":5.6,
                                "likeability_index":7.8,
                                "title":"The Sports Writing Handbook"
                            },
                            {
                                "popularity":0,
                                "published_year":null,
                                "page_count":"424",
                                "author_name":"Peter Merton McGinnis",
                                "id":2041695,
                                "isbn":"0736051015, 9780736051019",
                                "popularity_index":7.6,
                                "book_reader_relationship_index":4.5,
                                "goodness_index":5.6,
                                "likeability_index":7.8,
                                "title":"Biomechanics of Sport and Exercise"
                            },
                            {   
                                "popularity":0,
                                "published_year":null,
                                "page_count":"523",
                                "author_name":"Marie Dunford",
                                "id":1224582,
                                "isbn":"0495014834, 9780495014836",
                                "popularity_index":7.6,
                                "book_reader_relationship_index":4.5,
                                "goodness_index":5.6,
                                "likeability_index":7.8,
                                "title":"Nutrition for Sport and Exercise"
                            },
                            {
                                "popularity":1112,
                                "published_year":"June 1st 2004",
                                "page_count":"384",
                                "author_name":"Michael Mandelbaum",
                                "id":1570702,
                                "isbn":"1586483307, 9781586483302",
                                "popularity_index":7.6,
                                "book_reader_relationship_index":4.5,
                                "goodness_index":5.6,
                                "likeability_index":7.8,
                                "title":"The Meaning Of Sports"
                            },
                            {
                                "popularity":0,
                                "published_year":"   ",
                                "page_count":"304",
                                "author_name":"Elliott J. Gorn",
                                "id":2344031,
                                "isbn":"0252071840",
                                "popularity_index":7.6,
                                "book_reader_relationship_index":4.5,
                                "goodness_index":5.6,
                                "likeability_index":7.8,
                                "title":"A Brief History of American Sports"
                            },
                            {
                                "popularity":8,
                                "published_year":null,
                                "page_count":"0",
                                "author_name":"Joseph Strutt",
                                "id":1365463,
                                "isbn":"1430456647, 9781430456643",
                                "title":"The Sports and Pastimes of the People of England"
                            }
                        ]
                    }
                ],
                "view_count":67,
                "name":"Sports",
                "id":5024590,
                "image_url":"http://www.lf.k12.de.us/wp-content/uploads/2015/03/Sports.png",
                "label":["Community", "SuperCommunity"],
                "follow_count":3,
                "facebook_url":null,
                "twitter_url":null,
                "wiki_url":"https://en.wikipedia.org/wiki/Sport",
                "description":null,
                "website_url":null
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