var md = {};
md.popup = function(url, width, height) {
    var win_opts = 'toolbar=0,scrollbars=1,location=1,status=1,menubar=0,resizable=1';
    if(width && height) {
        win_opts += ',width=' + width + ',height=' + height;
    }
    var win = window.open(url, '_blank', win_opts);
};

md.toast = function(msg, type) {
    type = type || 'success';
    $('#flash div').remove();
    var toast = $('<div></div>').addClass('flash-' + type).addClass(type).text(msg);
    $('#flash').append(toast);
    setTimeout(function() {
        $('#flash div').hide(600, function() {
            $(this).remove();
        });
    }, 3000);
};

md.requireConfirm = function(target, input, require_text, label, label_text) {
    target = $(target);
    $(label).text(label_text.replace("*|REQUIRE|*", require_text));
    target.attr('disabled', true);
    $(input).bind('keyup', function() {
        target.attr('disabled', $(this).val() != require_text);
    });
};

md.checkSudoSession = function(url) {
    if(Math.floor(new Date().getTime() / 1000) >= _sudo_time) {
        $('#sudo-referrer').val(url);
        $('#sudo-password').val('');
        $('#sudo-dialog').dialog('open');
        return false;
    }

    return true;
};

md.logDebugInfo = function() {
    var data = '';
    var chunk = 1;
    while($.cookie('dbard' + chunk)) {
        data += $.cookie('dbard' + chunk).replace(/\+/g, ' ');
        chunk++;
    }

    try {
        data = JSON.parse(data);
        console.log('Request time: ' + (data.timing[0].stop * 1000).toFixed(1) + 'ms');
        $.each(data.logs, function(i, log) {
            console.log(log);
        });
    } catch(e) {
        console.log('Error logging debug info', e);
    }
};

var mddate = {};
mddate.month_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

mddate.formatDateTime = function(d) {
    return mddate.formatDate(d) + ' ' + mddate.formatTime(d);
};

mddate.formatDate = function(d) {
    return mddate.month_labels[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
};

mddate.formatTime = function(d) {
    var hour = d.getHours();
    var ampm = 'am';
    if(hour > 12) {
        hour -= 12;
        ampm = 'pm';
    } else if(hour == 12) {
        ampm = 'pm';
    } else if(hour == 0) {
        hour = 12;
    }

    return hour + ':' + mddate.zeroFill(d.getMinutes()) + ' ' + ampm;
};

mddate.dateOnly = function(ts) {
    var d = new Date(ts * 1000);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

mddate.zeroFill = function(num, places) {
    places = places || 2;
    num += '';
    while(num.length < places) {
        num = '0' + num;
    }
    return num;
};

mddate.parseDateUTC = function(str) {
    if (str == null) return null;

    var parts = str.split(/[\s-:.]/).map(function(p) { return parseInt(p, 10); });
    if (parts.length > 1) {
        parts[1] -= 1;
    }

    return new Date(Date.UTC.apply(null, parts.slice(0, 7)));
};

/**
 * Return either m/d/y or d/m/y depending on the user's locale
 */
mddate.shortFormat = function() {
    var d = new Date(2013, 0, 2);
    return d.toLocaleDateString().replace(/0/g, '') == '1/2/213' ? 'mm/dd/yy' : 'dd/mm/yy';
};

mddate.initshortdate = function(selector) {
    $(selector).each(function() {
        var f = (this.nodeName.toLowerCase() == 'input') ? 'val' : 'text';
        var el = $(this);
        var parts = el[f]().split('-');
        if (mddate.shortFormat() == 'mm/dd/yy') {
            var d = parts[1] + '/' + parts[2] + '/' + parts[0];
        } else {
            var d = parts[2] + '/' + parts[1] + '/' + parts[0];
        }
        el[f](d);
    });
};

mddate.initlocal = function(selector) {
    $(selector).each(function() {
        var span = $(this);
        span.text(mddate.formatDateTime(new Date(parseInt(span.text())*1000)));
    });
};

var mdsearchselect = {};
mdsearchselect.search = function(search) {
    mdsearchselect.open(search);

    $.getJSON(search.attr('data-searchurl'), {q: search.find('.searchinput').val()}, function(res) {
        var search_ul = search.find('.search-select-options');
        $.each(res, function(i, item) {
            search_ul.append($('<li />').attr('data-tagid', item.id).text(item.taglabel).click(function() {
                mdsearchselect.select(search, $(this).attr('data-tagid'), $(this).text());
            }));
        });
    });
};

mdsearchselect.select = function(search, tag_id, label) {
    var search_sel = search.parents('.search-select-form').find('select');
    search_sel.find('option').remove();
    search_sel.append($('<option />').attr('value', tag_id).text(label));
    search_sel.val(tag_id);
    mdsearchselect.close(search);
    search_sel.change();
};

mdsearchselect.open = function(search) {
    search.show().find('li').remove();
    $(document).on('keyup.mdsearchselect', function(e) {
        if(e.keyCode == 27) mdsearchselect.close(search);
    });
    $('.search-select-form').on('click.mdsearchselect', function(e) {
        e.stopPropagation();
    });
    $(document).on('click.mdsearchselect', function(e) {
        mdsearchselect.close(search);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    });

};

mdsearchselect.close = function(search) {
    search.hide();
    $(document).off('.mdsearchselect');
}

$(function() {
    mddate.initlocal('span.localdate');
    mddate.initshortdate('.short-date');

    $('input[type=hidden][name=date_format]').each(function() {
        $(this).val(mddate.shortFormat());
    });
});

$(document).ready(function(){
    $('.search-select-form select').live('focus', function(e){
        var search = $(this).parents('.search-select-form').find('.search-select');
        search.find('input.searchinput').val('');
        this.multiple = true;
        this.blur();
        setTimeout('$(".search-select-form select").attr("multiple", false)', 0);
        mdsearchselect.search(search);
        return false;
    });
    $('.search-select-form input.searchinput').keypress(function(e) {
        if(e.keyCode == 13) {
            mdsearchselect.search($(this).parents('.search-select-form').find('.search-select'));
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    $('.search-select-form button').click(function(e) {
        e.preventDefault();

        mdsearchselect.search($(this).parents('.search-select-form').find('.search-select'));
        return false;
    });

    if ($.cookie && $.cookie('dbard1')) {
        md.logDebugInfo();
    }
});
