$(function() {
	$('#find').click(function() {
		find_place();
		return false;
	});

	function find_place() {
		$('#results').empty().append('<p class="text-muted">Loading...</p>');
		var params = {'name': $('#name').val(), 'state': $('#state').val()};
		$.getJSON('/places', params, function(data) {
			console.log(data.length);
			$('#results').empty();
			if (data.length == 1) {
				find_titles(data[0]['loc']);
			} else if (data.length > 1) {
				$('#results').append('<label>Multiple places found, please choose one</label>');
				$.each(data, function(index, place) {
					var $item = $('<a></a>')
						.addClass('list-group-item')
						.data('loc', place['loc'])
						.html(place['name'])
						.attr('href', '#')
						.click(function() {
							var loc = $(this).data('loc');
							find_titles(loc);
						});
					console.log($item);
					$('#results').append($item);
				});
			} else {
				$('#results').append("<p class='text-warning'>Sorry couldn't find it...</p>");
			}
		});
	}

	function find_titles(loc) {
		$('#results').empty().append('<p class="text-muted">Loading...</p>');
		var params = {'lon': loc[0], 'lat': loc[1]};
		$.getJSON('/titles', params, function(data) {
			$('#results').empty();
			$.each(data, function(index, title) {
				var $item = $('<a></a>')
						.addClass('list-group-item')
						.html(title['title'])
						.attr('href', title['troveUrl']);
				$('#results').append($item);
			});
		});
	}
	
});