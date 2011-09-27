$(function() {
    window.App = {
        employees: null,
        filter: null,
        department: "Alle",
        allFilter: function(employee) {
            return true;
        },
        belongsToDepartmentFilter: function(employee) {
            return employee['Department'] == App.department;
        },
        showEmployee: function(id) {
            var employee = _.detect(this.employees,
            function(emp) {
                return emp['Id'] == id;
            });
            var template =
            '<div data-role="page" data-url="employee/{{Id}}">' +
            '<div data-role="header" data-position="inline">' +
            '<h1>{{FirstName}} {{LastName}}</h1>' +
            '</div>' +
            '<div data-role=content>' +
            '<img src="{{ImageUrl}}"/>' +
            '<br /><br />' +
            '<table class="ansatt">' +
            '<tr>' +
            '<th scope="row">Navn:</th>' +
            '<td>{{FirstName}} {{LastName}}</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row">Stilling:</th>' +
            '<td>{{Seniority}}</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row">Avdeling:</th>' +
            '<td>{{Department}}</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row">Faggruppe:</th>' +
            '<td>{{InterestGroup}}</td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row">Epost:</th>' +
            '<td><a href="mailto:{{Email}}">{{Email}}</a></td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row">Telefon:</th>' +
            '<td><a href="tel:{{MobilePhone}}">{{MobilePhone}}</a></td>' +
            '</tr>' +
            '<tr>' +
            '<th scope="row">Adresse:</th>' +
            '<td>{{StreetAddress}}, {{PostalNr}} {{PostalAddress}}</td>' +
            '</tr>' +
            '</table>' +
            '</div>' +
            '</div>';
            var html = Mustache.to_html(template, employee);
            var newPage = $(html);
            newPage.appendTo($.mobile.pageContainer);
            $.mobile.changePage(newPage);
        },
        render: function(data) {
            var template = '<li><a href="" onClick="App.showEmployee({{Id}}); return false;">' +
            '<img src="{{ImageUrl}}"/>' +
            '<h3>{{FirstName}} {{LastName}}</h3>' +
            '<p>{{Email}}</p></a></li>';
            var html = _.reduce(_.filter(data, this.filter),
            function(result, employee) {
                return result + Mustache.to_html(template, employee);
            },
            "");
            $('#employees').html(html).listview('refresh');
        },
        init: function() {
            this.filter = this.allFilter;
            var useLocal = true;
            var username = localStorage.getItem('username');
            var password = localStorage.getItem('password');
            var employeesData = localStorage.getItem('employeesData');
            if (employeesData != null && useLocal) {
                App.employees = JSON.parse(employeesData);
                App.render(App.employees);
            } else {
                if (username != null && password != null) {
                    $.ajax({
                        url: 'https://bekk-employees.herokuapp.com/employees',
                        data: {
                            username: username,
                            password: password
                        },
                        dataType: "jsonp",
                        error: function() {
                            $.mobile.changePage($("#loginPage"));
                        },
                        success: function(data) {
                            localStorage.setItem('employeesData', JSON.stringify(data));
                            App.employees = data;
                            App.render(data);
   
                           }
                    });
                } else {
                    $.mobile.changePage($("#loginPage"));
                }
            }
        }
    }
    $('.my-nav').click(function() {
        $('.ui-btn-active').removeClass('ui-btn-active');
        $(this).addClass('ui-btn-active');
        var $target = $(this).children();
        while ($target.length) {
            $target = $target.children();
        }
        var department = $target.end().text();
        if (department == "Alle") {
            App.filter = App.allFilter;
        } else {
            App.department = department;
            App.filter = App.belongsToDepartmentFilter;
        }
        App.render(App.employees);
        return false;
    });
    $("#loginForm").submit(function(e) {
        e.preventDefault();
        localStorage.setItem("username", $("#username").val());
        localStorage.setItem("password", $("#password").val());
        $.mobile.changePage($("#employeeListPage"));
        App.init();
        return false;
    });
    App.init();
});