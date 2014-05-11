function add_mapping(tag, subcategory, e, map_url){
	$(tag).addClass('mappable');
	var sub_category_id = $(subcategory).attr('id').split("sub_category_")[1];
	var tag_id = $(tag).attr('id').split("tag_")[1];
	var x = e.pageX;
	var y = e.pageY;
	$.ajax({
		url: map_url,
		data: "id="+tag_id+"&sub_category_id="+sub_category_id+"&x="+x+"&y="+y,
		success: function(d, t, j){
			$(tag).addClass("mapped_to_"+sub_category_id);
		},
		error: function(j, t, e){
			alert("Error in mapping the tag");
		}
	})
}

function ready_remove_mapping(tag, subcategory){
	$(tag).removeClass('mappable');
}

function remove_mapping(tag, e, unmap_url){
	var mappable = $(tag).hasClass('mappable');
	if(!mappable){
		var x = e.pageX;
		var y = e.pageY;
		var sub_category_id = $(tag).attr('class').split("mapped_to_")[1].split(" ")[0];
		var tag_id = $(tag).attr('id').split("tag_")[1];
		$.ajax({
			url: unmap_url,
			data: "id="+tag_id+"&sub_category_id="+sub_category_id+"&x="+x+"&y="+y,
			success: function(d, t, j){
				$(tag).removeClass("mapped_to_"+sub_category_id);
			},
			error: function(){
				alert("Error in removing the tag mapping.")
			}
		});
	}
}