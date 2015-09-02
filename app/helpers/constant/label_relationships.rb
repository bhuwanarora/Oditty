module Constant::LabelRelationships
	IncomingRel = 'IncomingRel'
	OutgoingRel = 'OutgoingRel'
	Incoming = 
	{
		Constant::NodeLabel::Category =>
		{
			'FromCategory'	=> {:type =>'FromCategory', :label => [Constant::EntityLabel::Book], :property => [] }
			'HasRoot' 		=> {:type => 'HasRoot', :label => [Constant::NodeLabel::Category], :property => [] }
			'Likes' 		=> {:type => 'Likes', :label => [Constant::EntityLabel::User], :property => [] }
			'HasChild' 		=> {:type => 'HasChild', :label => [Constant::NodeLabel::Category] :property => [] }
		},
		Constant::NodeLabel::Genre	=>
		{
			'Belongs_to'	=> {:type => 'Belongs_to', :label => [Constant::EntityLabel::Book], :property => ['weight'] }
			'Belongs_to'	=> {:type => 'Belongs_to', :label => [Constant::EntityLabel::HiddenBook] :property => ['weight'] }
			'FromCategory'	=> {:type =>'FromCategory', :label => [Constant::EntityLabel::Book], :property => [] }
			'FromCategory'	=> {:type =>'FromCategory', :label => [Constant::EntityLabel::HiddenBook] :property => [] }
			'HasChild'	   	=> {:type => 'HasChild', :label => [Constant::NodeLabel::Category], :property => [] }
		}
	}

	Outgoing =
	{
		Constant::NodeLabel::Category =>
		{
			'HasRoot' 		=> {:type => 'HasRoot', :label => [Constant::NodeLabel::Category], :property => [] }
			'HasChild' 		=> {:type => 'HasChild', :label => [Constant::NodeLabel::Category]	 :property => [] }
		},
		Constant::NodeLabel::Genre =>
		{
			'Belongs_to'	=> {:type => 'Belongs_to', :label => [Constant::EntityLabel::Book], :property => ['weight'] }
			'Belongs_to'	=> {:type => 'Belongs_to', :label => [Constant::EntityLabel::HiddenBook], :property => ['weight'] }
			'HasRoot' 		=> {:type => 'HasRoot', :label => [Constant::NodeLabel::Category], :property => [] }
			'HasChild' 		=> {:type => 'HasChild', :label => [Constant::NodeLabel::Category], :property => [] }
		}

	}
end