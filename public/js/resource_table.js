var loadTable = function() {
    $(document).ready(function() {
        var types = ['food', 'raw', 'water', 'fuel', 'exotic'];
        types.forEach(function(e) {
            $.ajax({
                'url': '../tech/defaults/resources/' + e,
                'dataType': 'json'
            }).done(function(values) {
                debugger;
            });
        });
        $.ajax({
            'url': '../tech/defaults/construction/cost',
            'dataType': 'json'
        }).done(function(values) {
            debugger;
        });
        $.ajax({
            'url': '../tech/defaults/construction/speed'
            'dataType': 'json'
        }).done(function(values) {
            debugger;
        });
    });
}
