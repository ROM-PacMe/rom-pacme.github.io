'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
Home : https://github.com/c0ncept/github-user-card
*/

var GITHUB_USER = 'ROM-PacMe';
var GITHUB_URL = 'https://api.github.com/users/';

Chart.defaults.global = {
  animation: true,
  animationSteps: 50,
  animationEasing: "easeOutBounce",
  scaleLabel: "<%=value%>",
  bezierCurve: true,
  bezierCurveTension: 1,
  scaleIntegersOnly: true,
  scaleBeginAtZero: false,
  maintainAspectRatio: false,
  onAnimationProgress: function onAnimationProgress() {},
  onAnimationComplete: function onAnimationComplete() {}
};

var Repo = function (_React$Component) {
  _inherits(Repo, _React$Component);

  function Repo() {
    _classCallCheck(this, Repo);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  Repo.prototype.render = function render() {
    var repo = this.props.repo;

    return React.createElement(
      'a',
      { className: 'repository', href: repo.html_url },
      React.createElement(
        'div',
        { className: 'repo-info' },
        React.createElement(
          'div',
          null,
          React.createElement('i', { className: 'fa fa-star' }),
          React.createElement('span', null),
          React.createElement(
            'span',
            { className: 'title' },
            repo.name
          )
        )
      )
    );
  };

  return Repo;
}(React.Component);

var DataChart = function (_React$Component2) {
  _inherits(DataChart, _React$Component2);

  function DataChart() {
    _classCallCheck(this, DataChart);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  DataChart.prototype.eventsRange = function eventsRange(event) {
    var range = [];
    for (var i = 11; i > 0; i--) {if (window.CP.shouldStopExecution(1)){break;}
      range.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }
window.CP.exitedLoop(1);

    var evtmp = this.props.events.filter(function (e) {
      return event(e.type);
    }).map(function (e) {
      return e.created_at.match(/^(\d{4}-\d{2}-\d{2}).*/)[1];
    });

    return range.map(function (r) {
      return evtmp.reduce(function (p, c) {
        return r === c ? p + 1 : p;
      }, 0);
    });
  };

  DataChart.prototype.componentDidMount = function componentDidMount() {
    var pushEvents = this.eventsRange(function (e) {
      return e === 'PushEvent';
    });
    var miscEvents = this.eventsRange(function (e) {
      return e !== 'PushEvent';
    });

    var lineChartData = {
      labels: pushEvents,
      datasets: [{
        fillColor: "#7E9BA0",
        strokeColor: "rgba(0,0,0,0)",
        pointColor: "rgba(255, 255, 255, 0)",
        pointStrokeColor: "rgba(255, 255, 255, 0)",
        data: pushEvents
      }, {
        fillColor: "#f06292",
        strokeColor: "rgba(0,0,0,0)",
        pointColor: "rgba(255, 255, 255, 0)",
        pointStrokeColor: "rgba(255, 255, 255, 0)",
        data: miscEvents
      }]
    };

    var ctx1 = document.getElementById("chart").getContext("2d");
    this.chart = new Chart(ctx1).Line(lineChartData);
  };

  DataChart.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'chart' },
      React.createElement('canvas', { id: 'chart', width: '370', height: '100' })
    );
  };

  return DataChart;
}(React.Component);

var RepoChart = function (_React$Component3) {
  _inherits(RepoChart, _React$Component3);

  function RepoChart() {
    _classCallCheck(this, RepoChart);

    return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
  }

  RepoChart.prototype.componentDidMount = function componentDidMount() {
    var htmlData = [{
      value: this.props.repos[0].stargazers_count,
      color: "#f8bbd0"
    }, {
      value: this.props.repos[1].stargazers_count,
      color: "#ec407a"
    }, {
      value: this.props.repos[2].stargazers_count,
      color: "#fff"
    }];
    var ctx2 = document.getElementById("pie").getContext("2d");
    new Chart(ctx2).Doughnut(htmlData, {
      segmentShowStroke: false,
      percentageInnerCutout: 80
    });
  };

  RepoChart.prototype.render = function render() {
    var totals = this.props.repos.reduce(function (p, c) {
      return p + c.stargazers_count;
    }, 0);
    return React.createElement(
      'div',
      { className: 'pie-chart-wrap' },
      React.createElement(
        'div',
        { className: 'pie-chart-totals' },
        React.createElement('i', { className: 'fa fa-star' }),
        totals
      ),
      React.createElement('canvas', { id: 'pie', className: 'pie-chart', width: '180', height: '180' })
    );
  };

  return RepoChart;
}(React.Component);

var Card = function (_React$Component4) {
  _inherits(Card, _React$Component4);

  function Card() {
    _classCallCheck(this, Card);

    return _possibleConstructorReturn(this, _React$Component4.apply(this, arguments));
  }

  Card.prototype.render = function render() {
    var reposData = this.props.repos.sort(function (a, b) {
      return b.stargazers_count - a.stargazers_count;
    }).slice(0, 3);
    var repos = reposData.map(function (r, i) {
      return React.createElement(Repo, { key: i, repo: r });
    });

    var starred = this.props.repos.reduce(function (p, c) {
      return p + Number(c.stargazers_count);
    }, 0);

    var forked = this.props.repos.reduce(function (p, c) {
      return p + Number(c.forks_count);
    }, 0);

    return React.createElement(
      'div',
      { className: 'card' },
      React.createElement(
        'div',
        { className: 'header' },
        React.createElement(
          'a',
          { className: 'userlink', href: this.props.user.html_url },
          this.props.user.login,
          React.createElement('i', { className: 'fa fa-link' })
        ),
        React.createElement(
          'div',
          { className: 'avatar' },
          React.createElement('img', { src: this.props.user.avatar_url })
        ),
        React.createElement(
          'span',
          { className: 'repos-count' },
          this.props.user.public_repos
        ),
        React.createElement(
          'div',
          { className: 'userinfo' },
          React.createElement(
            'h2',
            null,
            this.props.user.name || this.props.user.login
          ),
          React.createElement(
            'p',
            null,
            this.props.user.location
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'totals' },
        React.createElement(
          'div',
          null,
          this.props.user.followers,
          React.createElement(
            'div',
            { className: 'desc' },
            'Seguidores'
          )
        ),
        React.createElement(
          'div',
          null,
          starred,
          React.createElement(
            'div',
            { className: 'desc' },
            'Total Estrellas'
          )
        ),
        React.createElement(
          'div',
          null,
          forked,
          React.createElement(
            'div',
            { className: 'desc' },
            'Cantidad de Forks'
          )
        )
      ),
      React.createElement(DataChart, { events: this.props.events })
    );
  };

  return Card;
}(React.Component);

var Application = function (_React$Component5) {
  _inherits(Application, _React$Component5);

  function Application() {
    _classCallCheck(this, Application);

    var _this5 = _possibleConstructorReturn(this, _React$Component5.call(this));

    _this5.state = {
      user: {},
      repos: []
    };
    _this5.loadGitHubUser(GITHUB_USER);
    return _this5;
  }

  Application.prototype.loadGitHubUser = function loadGitHubUser(user) {
    var _this6 = this;

    Promise.all([fetch(GITHUB_URL + user).then(function (r) {
      return r.json();
    }), fetch(GITHUB_URL + user + '/repos').then(function (r) {
      return r.json();
    }), fetch(GITHUB_URL + user + '/events?per_page=300').then(function (r) {
      return r.json();
    })]).then(function (resp) {
      _this6.setState({
        user: resp[0],
        repos: resp[1],
        events: resp[2]
      });
    });
  };

  Application.prototype.render = function render() {
    var children = this.state.user.hasOwnProperty('login') ? React.createElement(Card, { user: this.state.user, repos: this.state.repos, events: this.state.events }) : React.createElement(
      'div',
      { className: 'loading' },
      React.createElement('span', null),
      React.createElement('span', null),
      React.createElement('span', null),
      React.createElement('span', null),
      React.createElement('span', null)
    );

    return React.createElement(
      'div',
      { className: 'wrapper' },
      children
    );
  };

  return Application;
}(React.Component);

ReactDOM.render(React.createElement(Application, null), document.getElementById('application'));