var imgurLoad = function () {
//$(function (){    

    // $( window).on( "swipeleft", function (){ alert('left');} );
    // $( window).on( "swiperight", function (){ alert('right');} );

    var clientId = '28d49b36bdbfb28';
    
    var documentHeight = $(document).height();
    $('#main').height(documentHeight * .9);
    var documentWidth = $('#main').width();

    var loading = false;
    
    

    function imgurGet(subreddit, sort, page, window) {        
        //Key	    Required	Value
        //subreddit	required	pics - A valid sub-reddit name
        //sort	    optional	time | top - defaults to time
        //page	    optional	integer - the data paging number
        //window	optional	Change the date range of the request if the sort is "top", day | week | month | year | all, defaults to week

        
        if (loading) {
            return;
        } else {
            loading = true;
        }
        
        var authorization = 'Client-ID ' + clientId;

        var url = 'https://api.imgur.com/3/gallery';
        if (subreddit) {
            url = url + '/r/' + subreddit;
            if (sort) {
                url = url + '/' + sort;
                if (window) {
                    url = url + '/' + window;
                }

                if (page) {
                    url = url + '/' + page;
                }
            }
        }

        $.ajax(
        {
            url: url,
            method: 'GET',
            headers: {
                Authorization: authorization,
                Accept: 'application/json'
            },        
            success: function (result) {
                viewModel.addImageList(result.data);
                loading = false;
            }, 
            error: function (e) {
                console.log('error ' + e);
            }
        });
    }

    function redditGetComments(urlInfo, callback) {        
        var url = 'http://www.reddit.com/' + urlInfo + '/.json';
        $.ajax(
        {
            url: url,
            method: 'GET',
            headers: {
                //Authorization: authorization,
                Accept: 'application/json'
            },        
            success: function (result) {
                
                callback(result[1].data.children);
            }, 
            error: function (e) {
                console.log('error ' + e);
            }
        });
    }

    function Comment(data){
        var self = this;
        self.body = data.body;
        self.ups = data.ups;
        self.downs = data.downs;
        self.body_html = data.body_html;
        self.author = data.author;
        self.created = data.created;
        self.created_utc = data.created_utc;
        self.id = data.id;
        self.link_id = data.link_id;
        self.name = data.name;


        //save for later
        //"data":{
         //    "subreddit_id":"t5_2qh33",
         //    "banned_by":null,
         //    "subreddit":"funny",
         //    "likes":null,
         //    "replies":"",
         //    "saved":false,
         //    "id":"cferapl",
         //    "gilded":0,
         //    "author":"GourangaPlusPlus",
         //    "parent_id":"t1_cfer99b",
         //    "approved_by":null,
         //    "body":"Aww but he was so cute",
         //    "edited":false,
         //    "author_flair_css_class":null,
         //    "downs":0,
         //    "body_html":"&lt;div class=\"md\"&gt;&lt;p&gt;Aww but he was so cute&lt;/p&gt;\n&lt;/div&gt;",
         //    "link_id":"t3_1xu3jc",
         //    "score_hidden":false,
         //    "name":"t1_cferapl",
         //    "created":1392364724.0,
         //    "author_flair_text":null,
         //    "created_utc":1392335924.0,
         //    "distinguished":null,
         //    "num_reports":null,
         //    "ups":8
         // }
        return self;
    }

    function Image(data) {
        var self = ko.mapping.fromJS(data);

        self.isImageView = ko.observable(true);
        self.scaledWidth = ko.observable(documentWidth - 50);
        self.scaledHeight = ko.observable((self.scaledWidth() * self.height()) / self.width());
        self.comments = ko.observableArray([]);
        
        self.gifPlayButtonUrl = ko.observable('img/play.png');
        self.isGifLoaded = ko.observable(false);

        self.thumbnailUrl = ko.computed(function () {
            if (self.animated()) {
                return self.link();
            } else {
                return self.link().replace(self.id(), self.id() + 'l');
            }
        });

        self.loadGif = function () {
            self.isGifLoaded(true);
        }

        self.clicked = function (data, event) {            
            self.isImageView(!self.isImageView());         
            if (!self.isImageView()) {
                var detailDiv = $('#' + self.id() + '_detailDiv');
                detailDiv.height(self.scaledHeight());
                detailDiv.width(self.scaledWidth());
                if (self.comments().length == 0) {
                    redditGetComments(self.reddit_comments(), self.addCommentList);        
                }                
            }
        };


        self.addCommentList = function (commentList) {
            for (var i = 0; i < commentList.length; i++) {           
                self.comments.push(new Comment(commentList[i].data));
            }            
        };

        return self;
    }

    function ViewModel() {
        // Data
        var self = this;
        self.subreddit = ko.observable('');
        self.images = ko.observableArray([]);
        self.currentPage = ko.observable(0);
        
        self.getRedditClicked = function () {
            self.images.removeAll();
            imgurGet(self.subreddit(), 'time', self.currentPage(), 'week');
            self.currentPage(1);
        };

        self.getPage = function () {
            imgurGet(self.subreddit(), 'time', self.currentPage(), 'week');
            self.currentPage(self.currentPage() + 1);
        };

        self.scrolled = function (data, event) {
            var elem = event.target;
            console.log('scrollTop : ' + elem.scrollTop + ' scrollHeight: ' + elem.scrollHeight + ' offsetHeight: ' + elem.offsetHeight );
            var v2 = ((elem.scrollHeight - elem.offsetHeight - (elem.scrollHeight * .25)));
            console.log('if ( ' + elem.scrollTop + ' > ( ' + v2 + ')');
            if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - (elem.scrollHeight * .25))) {            
                self.getPage();
                console.log('getPageNew');
            }            
        };

        self.imageCount = ko.computed(function () {
            return self.images.length;
        });

        self.computedReddit = ko.computed(function () {
            if (self.subreddit() != '') {
                self.images.removeAll();
                imgurGet(self.subreddit(), 'time', self.currentPage(), 'week');
                self.currentPage(1);
                return self.subreddit();
            }
        });

        //self.incompleteTasks = ko.computed(function () {
        //    return ko.utils.arrayFilter(self.tasks(), function (task) { return !task.isDone() });
        //});

        // Operations
        self.addImage = function (image) {
            self.images.push(new Image(image));
        };

        self.addImageList = function (imageList) {
            for (var i = 0; i < imageList.length; i++) {
                self.images.push(new Image(imageList[i]));
            }
        };

        //self.removeTask = function (task) { self.tasks.remove(task) };
        return self;
    };


    // Start
    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);
    //viewModel.getPage();        

//});

};

