module Constant::Id
	if Rails.env.development?
		Admin						= [3952772, 4084079]
		BestTinyRead				= 1250445 #"thelosthero"
		BestSmallRead				= 390687 #"thelittleprince"
		BestNormalRead				= 1171519 #"harrypotterandthephilosophersstone"
		BestLongRead				= 395152 #"thehungergames"
		BestBook					= 395152 #"thehungergames"
		BestGrid					= 2594148
	else
		Admin						= [4084079, 4105710]
		BestTinyRead				= 1250445 #"thelosthero"
		BestSmallRead				= 390687 #"thelittleprince"
		BestNormalRead				= 1171519 #"harrypotterandthephilosophersstone"
		BestLongRead				= 395152 #"thehungergames"
		BestBook					= 395152 #"thehungergames"
		BestGrid					= 2594148
	end	

	TinyReadNode	 			= 772852
	SmallReadNode	 			= 772853
	NormalReadNode	 			= 772854
	LongReadNode	 			= 772855

	OldEnglishLiterature		= 422359
	MiddleEnglishLiterature		= 422362
	EnglishRenaissance 			= 422366
	NeoClassicalPeriod 			= 422367
	Romanticism 				= 422370
	VictorianLiterature 		= 422371
	Modernism 					= 422372
	PostModernLiterature 		= 422373
	Contemporary				= 422374
	FacebookAppId 				= "174275722710475"
	GoodreadsAppId				= "2415071772"
end