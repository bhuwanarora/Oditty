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

    this.get_popular_books = function(){
        var data = [{
            "book_id":395152,
            "isbn":"0439023483,9780439023481",
            "title":"The Hunger Games",
            "author_name":"Suzanne Collins",
            "page_count":"374",
            "published_year":null,
            "popularity":1378178563613,
            "label":["Book","ActiveBook"],
            "readers_count":"0",
            "bookmark_count":46,
            "comment_count":"0",
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
            "published_year":"1960",
            "popularity":332676973337,
            "label":["Book","ActiveBook","PostModernLiterature"],
            "readers_count":1,
            "bookmark_count":35,
            "comment_count":"0",
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
            "published_year":"2005",
            "popularity":228536714734,
            "label":["Book","ActiveBook","Contemporary"],
            "readers_count":1,
            "bookmark_count":30,
            "comment_count":"0",
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
            "published_year":null,
            "popularity":361924156651,
            "label":["Book","ActiveBook"],
            "readers_count":"0",
            "bookmark_count":10,
            "comment_count":"0",
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
            "published_year":"2009",
            "popularity":403746845047,
            "label":["Book","ActiveBook","Contemporary"],
            "readers_count":"0",
            "bookmark_count":38,
            "comment_count":"0",
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
            "published_year":null,
            "popularity":422731118607,
            "label":["Book","ActiveBook"],
            "readers_count":2,
            "bookmark_count":22,
            "comment_count":"0",
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
            "published_year":"June 26th 1997",
            "popularity":415337944807,
            "label":["Book","ActiveBook","PostModernLiterature"],
            "readers_count":"1",
            "bookmark_count":31,
            "comment_count":"0",
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
            "published_year":null,
            "popularity":211579801218,
            "label":["Book","ActiveBook"],
            "readers_count":"0",
            "bookmark_count":40,
            "comment_count":"0",
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
            "published_year":null,
            "popularity":292102357248,
            "label":["Book","ActiveBook"],
            "readers_count":"0",
            "bookmark_count":7,
            "comment_count":"0",
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
            "published_year":"2011",
            "popularity":208877349400,
            "label":["Book","ActiveBook","Contemporary"],
            "readers_count":1,
            "bookmark_count":8,
            "comment_count":"0",
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
            "published_year":"2005",
            "popularity":236722591955,
            "label":["Book","ActiveBook","Contemporary"],
            "readers_count":"0",
            "bookmark_count":"0",
            "comment_count":"0",
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