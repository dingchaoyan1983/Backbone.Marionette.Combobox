/**
 * Created by Ding Chao(Dane) on 14-8-27.
 */
define(['marionette', 'handlebars', 'text!./ComboboxItemView.hbs', 'text!./ComboboxView.hbs'], function (Marionette, Handlebars, ComboboxItemViewTemplate, ComboboxViewTemplate) {
	var ComboboxItemView = Marionette.ItemView.extend({
		template: Handlebars.compile(ComboboxItemViewTemplate),
		tagName: 'li',
		events: {
			'click': 'select',
			'hover': 'hover'
		},
		select: function () {
			this.trigger('select');
		},
		hover: function () {
			this.trigger('hover');
		}
	});

	return Marionette.CompositeView.extend({
		template: Handlebars.compile(ComboboxViewTemplate),
		childView: ComboboxItemView,
		childViewContainer: '.dropdown-menu',
		timeoutHandler: null,
		filterCollection: null,
		focusIndex: 0,
		attributes: {
			style: 'position:relative;'
		},
		ui: {
			dropdown: '.dropdown-menu',
			input: 'input[type="text"]'
		},
		initialize: function () {
			this.backupCollection = this.collection.clone();

			$("body").on('click', function (e) {
				this.hideDropDown(e);
			}.bind(this));
		},
		onChildviewHover: function (childView) {
			this.clearSelected();
			childView.$el.addClass('active');
		},
		onChildviewSelect: function (childView) {
				this.ui.input.val(childView.model.get('name'));
				this.close();
		},
		events: {
			'focus input[type="text"]': 'onFilter',
			'keyup input[type="text"]': 'onFilter',
			'click input[type="text"]': 'onFilter',
			'keydown input[type="text"]': function (e) {
				if (e.charCode == 13 || e.keyCode == 13) {
					e.preventDefault();
				}
			}
		},
		onFilter: function (e) {
			if (e) {
				if (e.charCode == 13 || e.keyCode == 13) {
					e.preventDefault();

					var activeIndex = this.ui.dropdown.find('li.active').index(),
						view = null;

					if (activeIndex > -1) {
						view = this.children.findByIndex(activeIndex);
						this.ui.input.val(view.model.get('name'));
					}
					this.close();
					return;
				} else if (e.charCode == 40 || e.keyCode == 40) {
					e.preventDefault();
					this.next(e);
					return;
				} else if (e.charCode == 38 || e.keyCode == 38) {
					e.preventDefault();
					this.prev(e);
					return;
				}
			}

			if (this.timeoutHandler) {
				clearTimeout(this.timeoutHandler);
			}

			this.timeoutHandler = setTimeout(function () {
				var keyword = this.ui.input.val().toLowerCase(),
					filterArray = this.backupCollection.filter(function (model) {
						var name = model.get('name'),
							lowerCaseName = name.toLowerCase();

						return lowerCaseName.indexOf(keyword) > -1;
					}.bind(this));

				this.collection = new Backbone.Collection(filterArray);

				/*if (Backbone.$.browser.msie) {
					if (this.collection.length == 0) {
						this.ui.dropdown.height(0);
					} else {
						this.ui.dropdown.css('height', 'auto');
					}
				}*/

				this._renderChildren();

				if (!!this.collection.length) {
					this.ui.dropdown.show();
				} else {
					this.hideDropDown();
				}
			}.bind(this), 200);
		},
		close: function () {
			this.ui.dropdown.hide();
		},
		hideDropDown: function () {
			this.close();
		},
		prev: function (event) {
			var active = this.ui.dropdown.find('.active').removeClass('active'),
				prev = active.prev();

			if (!prev.length) {
				prev = this.ui.dropdown.find('li').last();
			}

			prev.addClass('active');
		},
		next: function (event) {
			var active = this.ui.dropdown.find('.active').removeClass('active'),
				next = active.next();

			if (!next.length) {
				next = $(this.ui.dropdown.find('li')[0]);
			}

			next.addClass('active');
		},
		setValue: function (value) {
			this.ui.input.val(value);
		},
		setCollection: function (collection) {
			this.collection = collection;
			this.backupCollection = this.collection.clone();
		},
		clearSelected: function () {
			this.children.each(function (view) {
				view.$el.removeClass('active');
			});
		}
	});
});