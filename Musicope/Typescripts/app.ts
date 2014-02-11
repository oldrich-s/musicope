module Musicope {

  $(document).ready(function () {

    ko.applyBindings(new Musicope.List.Controllers.Basic());

    window.onpopstate = () => {

      var view = $.url().param("view");

      if (view === "game") {

        $("#listView").hide();
        var c = new Musicope.Game.Controllers.Basic();

      } else if (view === "list") {

        $("#listView").show();
        

      } else {
        window.location.href = "?view=list";
      }

    };
    
  });

} 