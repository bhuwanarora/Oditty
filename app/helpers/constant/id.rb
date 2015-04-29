module Constant::Id
	if Rails.env.development?
		Admin						= 3952772
		BestTinyRead				= 395910 #"thelosthero"
		BestSmallRead				= 390072 #"thelittleprince"
		BestNormalRead				= 1171520 #"harrypotterandthephilosophersstone"
		BestLongRead				= 395153 #"thehungergames"
		BestBook					= 395153 #"thehungergames"
		BestGrid					= 2594148
	else
		Admin						= 4084079
		BestTinyRead				= 395910 #"thelosthero"
		BestSmallRead				= 390071 #"thelittleprince"
		BestNormalRead				= 1171522 #"harrypotterandthephilosophersstone"
		BestLongRead				= 395152 #"thehungergames"
		BestBook					= 395152 #"thehungergames"
		BestGrid					= 2594148
	end	

	TinyReadNode	 			= 772853
	SmallReadNode	 			= 772854
	NormalReadNode	 			= 772855
	LongReadNode	 			= 772856

	OldEnglishLiterature		= 422360
	MiddleEnglishLiterature		= 422363
	EnglishRenaissance 			= 422367
	NeoClassicalPeriod 			= 422368
	Romanticism 				= 422371
	VictorianLiterature 		= 422372
	Modernism 					= 422373
	PostModernLiterature 		= 422374
	Contemporary				= 422375
end