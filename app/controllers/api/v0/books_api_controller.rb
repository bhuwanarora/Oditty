module Api
	module V0
		class BooksApiController < ApplicationController
			def get_similar_books
				user_uuid = params[:id]
				book_uuid = params[:book_id]
				if user_uuid && book_uuid
					info = BookApi.get_similar_books(user_uuid, book_uuid)
					status = 200
				else
					info = {:message => "Invalid Request"}
					status = 400
				end
				render :json => info, :status => status
			end

			def get_book_details
				info = {
					:id => params[:id],
					:thumb => "assets/Siddhartha.jpg",
					:summary => "Siddhartha is a novel by Hermann Hesse 
						that deals with the spiritual journey of 
						self-discovery of a man named Siddhartha 
						during the time of the Gautama Buddha. 
						The book, Hesse's ninth novel, was written 
						in German, in a simple, lyrical style. It was 
						published in the U.S. in 1951 and became 
						influential during the 1960s. Hesse dedicated 
						Siddhartha to his wife Ninon and supposedly 
						afterwards to Romain Rolland and Wilhelm 
						Gundert. The word Siddhartha is made up 
						of two words in the Sanskrit language, 
						siddha + artha, which together means 
						\"he who has found meaning\" or \"he who 
						has attained his goals\". In fact, the Buddha's 
						own name, before his renunciation, was 
						Siddhartha Gautama, Prince of Kapilvastu, 
						Nepal. In this book, the Buddha is referred 
						to as \"Gotama\".",
					:background_color => "#FFD946",
					:characters => [
						{
							:id => 3,
							:name => "Siddhartha",
							:description => "The protagonist, who is constantly
							 searching for enlightenment. He eventually finds it 
							 through the knowledge of the river."
						},
						{
							:id => 4,
							:name => "Govinda",
							:description => "Siddhartha's best friend."
						},
						{
							:id => 5,
							:name => "Gotama",
							:description => "Spiritual leader; Buddha. Many look up to him and follow his doctrine."
						},
						{
							:id => 6,
							:name => "Vasudeva",
							:description => "Add a description to this character",
						},
						{
							:id => 7,
							:name => "Kamala",
							:description => "Siddhartha's lover"
						},
						{
							:id => 8,
							:name => "Kamaswami",
							:description => "The Merchant who teaches Siddhartha the tricks of his trade."
						}
					],
					:first_sentence => "SIDDHARTHA, the handsome son of the Brahmin, the young falcon, grew up 
						together with his friend Govinda, the Brahmin's son, in the shadow of the house, in the sun of the 
						riverbank near the boats, in the shadow of the sala forest, and in the shadow of the fig trees.",
					:note_for_parents => "Although a child could understand the words, it would be really hard to 
						comprehend the underlying meaning. Wait until high school.",
					:quotes => [
						{
							:quote => "“When someone is seeking, it happens quite easily that he only sees the thing 
								that he is seeking; that he is unable to find anything, unable to absorb anything because 
								he is only thinking of the thing he is seeking...”",
							:from => ""
						},
						{
							:quote => "“To whom else should one sacrifice, to whom else was veneration due but to him, 
								the Only One, Atman? And where was Atman to be found, where did he dwell, where did his eternal 
								heart beat if not in one’s own self, in the innermost, in the indestructible essence that every 
								person bore within? But where, where was this self, this innermost, this ultimate? It was not 
								flesh and blood, it was not thinking or consciousness—that was what the wisest teach. But then 
								where, where was it? To pierce there, to the self, to myself, to Atman—was there any other path 
								worth seeking?”",
							:from => "Siddhartha"
						},
						{
							:quote => "“Her clever red lips taught him a lot. Her tender, supple hand taught him a lot. In 
								regard to love, he was still a boy, and he tended to plunge into pleasure blindly, endlessly, 
								insatiably. So she thoroughly taught him that one cannot take pleasure without giving pleasure, 
								and that every gesture, every caress, every touch, every glance, every last bit of the body has 
								its secret, which brings happiness to the person who knows how to wake it.”",
							:from => ""
						},
						{
							:quote => "“She taught him that after a celebration of love the lovers should not part without 
								admiring each other, without being conquered or having conquered, so that neither is bleak or 
								glutted or has the bad feeling of having misused or been misused.”",
							:from => ""
						},
						{
							:quote => "“Where are you going, by friend?I am not going anywhere. We … are always on the way…. 
								But where are you going, Siddhartha?It is the same with me at it is with you, my friend. I am not 
								going anywhere. I am only on the way.”",
							:from => ""
						},
						{
							:quote => "“But today he only saw one of the river’s secrets, one that gripped his soul. He saw 
								that the water continually flowed and flowed and yet it was always there; it was always the same 
								and yet every moment it was new.”",
							:from => ""
						},
						{
							:quote => "“Where are you going, by friend?I am not going anywhere. We … are always on the way…. 
								But where are you going, Siddhartha?It is the same with me at it is with you, my friend. I am not 
								going anywhere. I am only on the way.”",
							:from => ""
						},
						{
							:quote => "“But today he only saw one of the river’s secrets, one that gripped his soul. He saw 
								that the water continually flowed and flowed and yet it was always there; it was always the same 
								and yet every moment it was new.”",
							:from => ""
						}
					],
					:themes => [
						{
							:title => "The Search for Spiritual Enlightenment: Describe this theme.",
							:description => ""
						},
						{
							:title => "Inner vs. Exterior Guidance",
							:description => ""
						},
						{
							:title => "The Wisdom of Indirection",
							:description => ""
						},
						{
							:title => "Love",
							:description => ""
						},
						{
							:title => "Om",
							:description => ""
						},
						{
							:title => "Polarities",
							:description => ""
						}
					],
					:subject_places => [

					],
					:movie_based => nil,
					:tags => [
						{
							:id => 1,
							:name => "1001 books you must read before you die",
							:url => ""
						},
						{
							:id => 2,
							:name => "20th century",
							:url => ""
						},
						{
							:id => 3,
							:name => "adventure",
							:url => ""
						},
						{
							:id => 4,
							:name => "allegorical novel",
							:url => ""
						},
						{
							:id => 5,
							:name => "allegory",
							:url => ""
						},
						{
							:id => 6,
							:name => "asia",
							:url => ""
						},
						{
							:id => 7,
							:name => "boring",
							:url => ""
						},
						{
							:id => 8,
							:name => "buddha",
							:url => ""
						},
						{
							:id => 9,
							:name => "buddhism",
							:url => ""
						},
						{
							:id => 10,
							:name => "caste system",
							:url => ""
						},
						{
							:id => 11,
							:name => "classic",
							:url => ""
						},
						{
							:id => 12,
							:name => "classic literature",
							:url => ""
						},
						{
							:id => 13,
							:name => "classics",
							:url => ""
						},
						{
							:id => 14,
							:name => "coming of age",
							:url => ""
						},
						{
							:id => 15,
							:name => "eastern philosophy",
							:url => ""
						}
					],
					:news => [
						{
							:thumb => "http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2014/2/19
							/1392802798841/d7111211-6010-4fb3-a86f-5416a7051b9d-460x276.jpeg",
							:title => "Billy Corgan to perform eight-hour jam inspired by Herman Hesse's 
							Siddhartha",
							:description => "Billy Corgan has announced that he will be performing an 
							eight-hour jam inspired by the Herman Hesse novella Siddhartha. The all-day 
							ambient show will be presented at his Chicago tea shop on 28 February.

							The Smashing Pumpkins bandleader shared concert details by posting on Facebook
							 (via Stereogum). “[The] performance will be centered around an ambient/musical 
							 interpretation of [the book] ... built by modular synthesis, on the fly,” he 
							 wrote. “Readings of the text [will] go hand in hand with whatever is created.”
							  The show will begin at noon and last between eight and nine hours.

							Said tea shop, Madame ZuZu’s, was launched in 2012. Corgan described it then 
							as a “salon ... [where] like-minded people can discuss ideas and performance 
							art”. From the start, Corgan emphasised that he wanted this space to be a 
							showcase for literature, including his own poetry; he admitted to the Chicago 
							Tribune that he has been writing “a spiritual memoir” since around 2010.

							Indeed, Corgan is one of those 30m-album-selling rockers for whom an eight-hour 
							Buddhist synth jam seems par for the course. Before his tea shop, the 46-year-old 
							launched a religion/philosophy website called Everything From Here To There. He 
							also became a wrestling promoter. And although many critics might mock Corgan’s 
							pretense, his fans have his back: “He’s just hanging out at his tea shop playing 
							music,” one wrote on Facebook. “How is that pretentious?”",
							:source => "http://www.theguardian.com/",
							:type => "img"
						},
						{
							:thumb => "http://www.youtube.com/watch?feature=player_embedded&v=C3tV8n-CVnA",
							:title => "Herman Hesse’s Siddhartha, Interpreted For Modular Synthesizer By 
							William Corgan",
							:description => "Here’s the video stream for the 8-hour marathon version of Herman 
							Hesse’s Siddhartha, interpreted for modular synthesizer by William Corgan (of The 
								Smashing Pumpkins). 

							It’s from a live improvised performance at at Madame ZuZu?s Teahouse (Chicago). 
							Corgan describes the event as ‘an ambient/musical interpretation of Hermann 
							Hesse?s Siddhartha; built by modular synthesis, on the fly.’",
							:type => "video"
						}
					]
				}
				render :json => info, :status => 200
			end

		end
	end
end