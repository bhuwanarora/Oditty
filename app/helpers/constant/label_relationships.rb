module Constant::LabelRelationships
	IncomingRel = 'IncomingRel'
	OutgoingRel = 'OutgoingRel'
	Incoming = 
	{
		Constant::NodeLabel::Category =>
		[
			{:type =>'FromCategory', :label => [Constant::EntityLabel::Book], :property => [] },
			{:type => 'HasRoot', :label => [Constant::NodeLabel::Category], :property => [] },
			{:type => 'Likes', :label => [Constant::EntityLabel::User], :property => [] },
			{:type => 'HasChild', :label => [Constant::NodeLabel::Category], :property => [] }
		],
		Constant::NodeLabel::Genre	=>
		[
			{:type => 'Belongs_to', :label => [Constant::EntityLabel::Book], :property => ['weight'] },
			{:type => 'Belongs_to', :label => [Constant::EntityLabel::HiddenBook], :property => ['weight'] },
			{:type =>'FromCategory', :label => [Constant::EntityLabel::Book], :property => [] },
			{:type =>'FromCategory', :label => [Constant::EntityLabel::HiddenBook], :property => [] },
			{:type => 'HasChild', :label => [Constant::NodeLabel::Category], :property => [] }
		]
	}

	Outgoing =
	{
		Constant::NodeLabel::Category =>
		[
			{:type => 'HasRoot',  :label => [Constant::NodeLabel::Category], :property => [] },
			{:type => 'HasChild', :label => [Constant::NodeLabel::Category],	 :property => [] }
		],
		Constant::NodeLabel::Genre =>
		[
			{:type => 'Belongs_to', :label => [Constant::EntityLabel::Book], :property => ['weight'] },
			{:type => 'Belongs_to', :label => [Constant::EntityLabel::HiddenBook], :property => ['weight'] },
			{:type => 'HasRoot', :label => [Constant::NodeLabel::Category], :property => [] },
			{:type => 'HasChild', :label => [Constant::NodeLabel::Category], :property => [] }
		]

	}
end