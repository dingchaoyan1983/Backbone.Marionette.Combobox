Backbone.Marionette.Combobox
============================

backbone marionette combobox


      require(['backbone', 'jquery', './lib/ComboboxView'], function (Backbone, $, ComboboxView) {
          var personCollection = new Backbone.Collection([
              {name: 'test1'},
              {name: 'test2'}
          ]);

          var combo = new ComboboxView({
              collection: personCollection
          });

          $('body').html(combo.render().$el);
        })
