;(function($, window) {

	// instantiate jQTouch	
	var jQT;
	$(function(){ jQT = new $.jQTouch({}); });
	
	$('#home').bind('pageAnimationEnd', function(event, info) {		
		if (info.direction == 'in') {
			$("#map").show();
			google.maps.event.trigger(map.map, 'resize');
			map.map.setZoom(map.mapOptions.zoom);
			map.map.fitBounds(map.bounds);
		}
		return false;
	});
	
	// add new location
	$('#new-location').submit(function(e) {
		
		var $t      = $(this);
		var $name   = $t.find('#name');
		var $street = $t.find('#street');
		var $city   = $t.find('#city');
		var $state  = $t.find('#state');
		var $zip    = $t.find('#zip');

		var address = [
			$street.val(),
			$city.val(),
			$state.val(),
			$zip.val()
		];
		
		var obj = {
			name: $name.val(),
			address: address.join(' '),
			street: $street.val(),
			city: $city.val(),
			state: $state.val(),
			zipcode: $zip.val()
		}
		
		map.addMarker(obj, function() {
			map.home();
			$name.val('');
			$street.val('');
			$city.val('');
			$state.val('');
			$zip.val('');
		});
		
		e.preventDefault();
		
		return false;
	});
	
	// edit a current location
	$('#edit-location').submit(function(e) {
		
		var $t      = $(this);
		var $name   = $t.find('#name');
		var $street = $t.find('#street');
		var $city   = $t.find('#city');
		var $state  = $t.find('#state');
		var $zip    = $t.find('#zip');
		
		var address = [
			$street.val(),
			$city.val(),
			$state.val(),
			$zip.val()
		];
		
		var obj = {
			name: $name.val(),
			address: address.join(' '),
			street: $street.val(),
			city: $city.val(),
			state: $state.val(),
			zipcode: $zip.val()
		}
		
		map.editMarker(obj, function() {
			map.home();
			$name.val('');
			$street.val('');
			$city.val('');
			$state.val('');
			$zip.val('');
		});
		
		e.preventDefault();
		
		return false;
	});
	
	$('#search').on('submit', function(e) {
		var $t = $(this);
		var location = $t.find('#location').val();
		var distance = $t.find('#distance').val();
		
		map.search(location, distance, function(results, response) {
			if(response.success) {				
				map.hideMarkers();
				
				var bounds = new google.maps.LatLngBounds();
				
				$.each(results, function(i, row) {
					var marker = map.markers[row.ID - 1];
					
					marker.setVisible(true);
					bounds.extend(marker.getPosition());
				});
				
				if(results.length > 0) {
					map.setBounds(bounds);
				}
				
				$('.clear').show();
			}
		});
		
		e.preventDefault();
	});

	var map = $('#map').MobileMap({
		mapOptions: {
			center: new google.maps.LatLng(40, -86)
		},
		callback: {
			newMarker: function(marker, lat, lng, index) {
				google.maps.event.addListener(marker, 'click', function() {
				
					map.editIndex = index;
					
					var row = map.db.query('markers', function(row) {
						if(row.ID == index+1) {
							return true;
						}
						return false;
					});
					
					row = row[0];
					
					var form    = $('#edit-location');
					var $name   = form.find('#name');
					var $street = form.find('#street');
					var $city   = form.find('#city');
					var $state  = form.find('#state');
					var $zip    = form.find('#zip');
					
					$name.val(row.name);
					$street.val(row.street);
					$city.val(row.city);
					$state.val(row.state);	
					$zip.val(row.zipcode);
					
					jQT.goTo('#edit', 'slideup');		
					
				});
			}
		}
	});
	
}(jQuery, this));