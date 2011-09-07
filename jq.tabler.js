(function($){
	$.fn.tabler = function(options) {
		var parent = this;
		this.options;
		
		this.init = function(options) {
			parent.options = options;
			
			$(this).addClass('tabler');
			
			parent.initListeners();
			
			parent.rows = new parent.rows();
			
			return parent;
		};
		
		this.initListeners = function() {
			if (typeof parent.options.saveOnClickElement != 'undefied') {
				$(parent.options.saveOnClickElement).click(function() {
					$.ajax({
						url: parent.options.saveUrl,
						method: 'post',
						data: {
							'tabler': parent.rows.data()
						},
						success: function(response) {
							
						}
					});
				});
			}
			
			return parent;
		};

		this.rows = function(options) {
			var rows = this;
			this.rowObjects = new Array();
			this.mouseDown = false;
			this.mouseMove = false;
			this.moving = false;
			this.dragDirection;
			this.lastPageY;
			
			this.init = function(options) {
				this.initRows();
				this.initListeners();
				
				return rows;
			};
			
			this.initRows = function() {
				$.each($(parent).find('tr:not(:eq(0))'), function(index, $rowEl) {
					var row = new rows.row({
						index: index,
						el: $rowEl
					});
					
					rows.rowObjects.push(row);
				});
				return rows;
			};
			
			this.initListeners = function() {
				$.each(rows.rowObjects, function(index, row) {
					$(row.$el).mousedown(function(mainEvent) {
						rows.setMouseDown(true);
						mainEvent.preventDefault();
						$(mainEvent.currentTarget, 'html', 'body').css({
							cursor: 'move'
						});
						
						var $tmpEl = $(this);
						
						$('html').mousemove(function(event) {
							rows.setMouseMove(true);
							
							if (rows.mouseDown == true) {
								mainEvent.preventDefault();
								event.preventDefault();

								rows.disableTextSelection();
								
								if (rows.moving == false || rows.moving == mainEvent.currentTarget) {
									$($tmpEl).addClass('tabler-moving');
									
									rows.checkDragDirection(event);
									rows.checkDragPosition(mainEvent, event);
									
									rows.moving = mainEvent.currentTarget;
									
									rows.setIndexes();
								}
							}
						}).mouseup(function() {
							rows.setMouseDown(false);
							rows.moving = false;
							
							$(this).unbind();
							
							$($tmpEl).removeClass('tabler-moving');
							$(mainEvent.currentTarget, 'html', 'body').css('cursor', '');
						});
					});
				});
				
				return rows;
			};
			
			this.checkDragPosition = function(event, documentEvent) {
				var buffer = $(event.currentTarget).height() / 2;
			
				if (rows.dragDirection == 'up' && $(event.currentTarget).offset().top >= documentEvent.pageY) {
					var newIndex = $(event.currentTarget).parent().find('tr').index(event.currentTarget) - 1;
					
					if (newIndex > 0) {
						var newPos = $(event.currentTarget).parent().find('tr:eq(' + newIndex + ')');
						
						$(event.currentTarget).after(newPos);
					}
				} else if (rows.dragDirection == 'down' && ($(event.currentTarget).offset().top + $(event.currentTarget).height() + buffer) <= documentEvent.pageY) {
					var newIndex = $(event.currentTarget).parent().find('tr').index(event.currentTarget) + 1;

					var newPos = $(event.currentTarget).parent().find('tr:eq(' + newIndex + ')');

					$(event.currentTarget).before(newPos);
				}
				
				return rows;
			};
			
			this.checkDragDirection = function(event) {
				if (event.pageY > rows.lastPageY)
				rows.dragDirection = 'down';
				else
				rows.dragDirection = 'up';

				rows.lastPageY = event.pageY;
				
				return rows;
			};
			
			this.data = function() {
				var data = '';
				
				$.each(rows.rowObjects, function(index, row) {
					if (data != '')
					data += ',';
					
					data += '{';
					data += '"id":"' + row.attr.id + '",';
					data += '"index":"' + row.index() + '"';
					data += '}';
				});

				return '[' + data + ']';
			};
			
			this.setIndexes = function() {
				if (typeof parent.options.indexElement != 'undefied') {
					$.each(rows.rowObjects, function(index, row) {
						row.updateIndex();
					});
				}
				
				return rows;
			};
			
			this.disableTextSelection = function() {
				$.each(rows.rowObjects, function(index, row) {
					$(row.$el).find('td, th').css({
						'MozUserSelect': 'none',
					   '-webkit-user-select': 'none',
					   'user-select': 'none'
					}).attr('unselectable', 'on');
				});
				
				return rows;
			};
			
			this.setMouseDown = function(value) {
				rows.mouseDown = value;
				return rows;
			};
			
			this.setMouseMove = function(value) {
				rows.mouseMove = value;
				return rows;
			};
			
			this.row = function(options) {
				var row = this;
				this.options;
				this.$el;
				this.attr = {};
				
				this.init = function(options) {
					row.options = options;
					row.$el = options.el;
					
					this.initEl();
					this.initListeners();
					
					return row;
				};
				
				this.initEl = function() {
					$(row.$el).addClass('tabler-tr');

					row.attr.id = $(row.$el).find(parent.options.idElement).val();
					
					return row;
				};
				
				this.initListeners = function() {
					return row;
				};
				
				this.index = function() {
					return $(row.$el).parent().find('tr').index(row.$el);
				};
				
				this.updateIndex = function() {
					$(row.$el).find(parent.options.indexElement).text(row.index());
					
					return row;
				};
				
				this.init(options);
			};
			
			this.init(options);
		};
		
		this.init(options);
	};
})( jQuery );