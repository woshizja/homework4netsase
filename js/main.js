// 构造的博客数据
var blogData = [{
	id: "fks_080074081",
	title: "js高性能原则(转载)",
	blogContent: "javascript是一种解释型语言，性能无法达到和C、C++等编译语言的水平，但还是有一些方法来改进。",
	allowView: -100,
	modifyTime: 1491675304961,
	accessCount: 23,
	commentCount: 10,
	rank: 5,
	className: ["前端", "JS", "转载"]
}, {
	id: "fks_080074092",
	title: "dwr简单配置",
	blogContent: "dwr的配置步骤：\n1.引入dwr.jar(dwr2.0 需要把commons-logging.jar引入)\n2.配置dwr.xml\n3.在web.xml配置dwr请求\n4.test",
	allowView: -100,
	modifyTime: 1491975454061,
	accessCount: 152,
	commentCount: 61,
	rank: 0,
	className: ["后端", "DWR"]
}, {
	id: "fks_080074093",
	title: "javascript大全",
	blogContent: "由浅入深、循序渐进地介绍了JavaScript的核心语法、BOM模型中的对象以及对象方法和属性、DOM以及接口的使用方法，还介绍了Ajax开发技术。全书分4篇讲解。第1篇为JavaScript语言基础第2篇为常用对象，主要介绍JavaScript核心的全局对象、函数和数组等；第3篇为JavaScript核心技术，主要介绍BOM模型中的对象层次与事件、窗口对象、文档对象、屏幕对象、浏览器对象、历史对象、地址对象、DOM模型中的接口、DOM与正则表达式的结合使用等；第4篇为Ajax开发，主要介绍了Ajax与服务器、XML、CSS等方面的交互运用。《JavaScript开发技术大全》适合于掌握了HTML语言、想进一步学习和全面学习动态网页的读者使用，也适合作为广大网站开发和网页设计人员的案头必备读物。",
	allowView: -100,
	modifyTime: 1491145402333,
	accessCount: 19,
	commentCount: 6,
	rank: 0,
	className: ["前端", "JS", "工具书"]
}, {
	id: "fks_080074094",
	title: "闲谈1999",
	blogContent: "开篇就结束了",
	allowView: 10000,
	modifyTime: 1491249402333,
	accessCount: 19,
	commentCount: 6,
	rank: 0,
	className: ["扯谈"]
}];

// 构造的最新博客数据（简化ed）
var latestBlogData = [{
	title: "浅灰色的云彩",
	desc: "蓝色的天空有云朵"
}, {
	title: "暴雪倒闭啦",
	desc: "因迟迟不更新魔兽世界，暴雪面临倒闭"
}, {
	title: "摄影技术提升速成",
	desc: "老师教你学摄影，上车！"
}, {
	title: "这个是充数的",
	desc: "充数充数充数充数充数"
}, {
	title: "天气预测算法",
	desc: "想知道吗？"
}];

// 一些全局变量
var lastClickedTab; // 记录左侧被点击的元素
var latestBlogList; // 最新博客展示区域
var latestBlogArray; // 代表更新的内容
var shouldUpdateBlog = true; // 允许博客更新
var classesForClick = ["menu-drop-light", "delete-blog", "stick-blog", "edit-blog", "choose-all", "delete-selected", "pub-blog", "clear-blog", "show-tag", "show-log"];

window.addEventListener("load", initPage);

/**
 * [initPage 初始化页面]
 * @return null
 */
function initPage() {
	lastClickedTab = document.querySelector(".side .tab-item.active");
	latestBlogList = document.querySelector(".content .latest .blogs");
	latestBlogArray = [0, 1, 2, 3, 4];

	createBlogList(blogData); // 生成博客列表
	setGreeting(); // 设置问候语
	updateLatestBlog(); // 开始更新博客

	// latestBlogList监听悬停事件
	latestBlogList.addEventListener("mouseenter", function() {
		shouldUpdateBlog = false;
	});
	latestBlogList.addEventListener("mouseleave", function() {
		shouldUpdateBlog = true;
		setTimeout(updateLatestBlog, 2000);
	});

	// 模拟placeholder
	document.querySelector(".publish .detail").addEventListener("focus", function(e) {
		if (e.target.innerText === '这里可以写日志哦~') {
			e.target.innerText = '';
			e.target.style.color = "#333";
		}
	});
	document.querySelector(".publish .detail").addEventListener("blur", function(e) {
		if (e.target.innerText === '') {
			e.target.innerText = '这里可以写日志哦~';
			e.target.style.color = "#999";
		}
	});

	// 监控全局的click事件
	window.addEventListener("click", function(e) {
		e = e || window.event;
		var target = e.target;
		var classList = target.classList;
		classList = classList || target.className.split(" ").filter(function(ele) {
			return ele !== "";
		});
		clickDispatcher(target, classList); // 派发
	});
}

/**
 * [clickDispatcher 单击事件的分发器]
 * @param  {Event} target    [事件]
 * @param  {Array} classList [类名数组]
 * @return null
 */
function clickDispatcher(target, classList) {
	if (target.parentElement && target.parentElement.classList.contains("tab-item")) {
		leftMenuClicked(target.parentElement);
	}
	if (classList.length === 0) {
		return;
	}
	var len = classesForClick.length;
	while (len--) {
		if (classList.contains(classesForClick[len])) {
			switch (len) {
				case 0: // "更多"菜单切换显示
					toggleMoreMenu(target);
					break;
				case 1: // 删除博客
					deleteBlog(target.parentElement.dataset.index);
					break;
				case 2: // 置顶博客
					stickBlog(target.parentElement.dataset.index);
					break;
				case 3: // 编辑博客
					editBlog(target.dataset.index);
					break;
				case 4: // 全选
					selectAllBlog(target.checked);
					break;
				case 5: // 删除所选博客
					deleteSelectedBlog();
					break;
				case 6: // 发布博客
					publicBlog(target);
					break;
				case 7: // 清空博客
					clearBlog(target);
					break;
				case 8: // 显示标签
					toggleLogAndTag(target, classList, createTags);
					break;
				case 9: // 显示日志
					toggleLogAndTag(target, classList);
					break;
			}
			break;
		}
	}
	if (len !== 0) { // 隐藏菜单
		toggleMoreMenu();
	}
}

/**
 * [publicBlog 发布博客]
 * @param  {[Event]} target [单击事件]
 * @return null
 */
function publicBlog(target) {
	target.parentElement.children[0].classList.remove("wrong");
	target.parentElement.children[1].classList.remove("wrong");
	addBlog();
}

/**
 * [clearBlog 清空博客]
 * @param  {[Event]} target [单击事件]
 * @return null
 */
function clearBlog(target) {
	target.parentElement.children[0].classList.remove("wrong");
	target.parentElement.children[1].classList.remove("wrong");
	target.parentElement.children[0].value = '';
	target.parentElement.children[0].dataset.index = -1;
	target.parentElement.children[0].dataset.blogId = '';
	target.parentElement.children[1].style.color = "#999";
	target.parentElement.children[1].innerText = '这里可以写日志哦~';
}

/**
 * [toggleLogAndTag 切换显示日志和标签]
 * @param  {[type]}   target
 * @param  {[type]}   classList
 * @param  {Function} callback  [回调函数]
 * @return {[type]}             [description]
 */
function toggleLogAndTag(target, classList, callback) {
	if (classList.contains("active")) {
		return;
	}
	target.classList.add("active");
	var log = document.querySelector(".content .manage .tab-log");
	var tag = document.querySelector(".content .manage .tab-tag");
	if (log.classList.contains("hide")) {
		document.querySelector(".content .manage .show-tag").classList.remove("active");
		log.classList.remove("hide");
		tag.classList.add("hide");
	} else {
		document.querySelector(".content .manage .show-log").classList.remove("active");
		log.classList.add("hide");
		tag.classList.remove("hide");
		if (callback && callback instanceof Function) {
			callback(blogData);
		}
	}
}

/**
 * [leftMenuClicked 左侧菜单点击]
 * @param  {[type]} target
 * @return null
 */
function leftMenuClicked(target) {
	if (target.classList.contains("active")) {
		target.classList.remove("active")
	} else {
		target.classList.add("active")
	}
	lastClickedTab.classList.remove("active");
	lastClickedTab = target;
}

/**
 * [selectAllBlog 全选]
 * @param  {[bool]} checked [全选或取消全选]
 * @return null
 */
function selectAllBlog(checked) {
	var blogs = document.querySelectorAll(".blog-item");
	var len = blogs.length;
	for (var i = 0; i < len; i++) {
		blogs[i].children[0].checked = checked;
	}
}

/**
 * [toggleMoreMenu 切换菜单显示]
 * @param  {[type]} target
 * @return null
 */
function toggleMoreMenu(target) {
	if (!target) {
		var menus = document.querySelectorAll(".menu-drop-light");
		var len = menus.length;
		for (var i = 0; i < len; i++) {
			menus[i].classList.remove("open");
		}
		return;
	}
	if (target.classList.contains("open")) {
		target.classList.remove("open");
	} else {
		target.classList.add("open");
	}
}

/**
 * [editBlog 编辑博客]
 * @param  {[type]} index [序列号]
 * @return null
 */
function editBlog(index) {
	var title = document.querySelector(".publish .title");
	title.dataset.index = index;
	title.dataset.blogId = blogData[index].id;
	title.value = blogData[index].title;
	var detail = document.querySelector(".publish .detail");
	detail.style.color = "#333";
	detail.innerText = blogData[index].blogContent;
}

/**
 * [addBlog 添加博客]
 */
function addBlog() {
	var title = document.querySelector(".publish .title");
	var index = title.dataset.index;
	var detail = document.querySelector(".publish .detail");
	if (!title.value) {
		title.classList.add("wrong");
		return;
	} else if (detail.innerText === '这里可以写日志哦~') {
		detail.classList.add("wrong");
		return;
	}
	// 使用hash生成ID
	var blogId = hashEncode(detail.innerText);
	title.dataset.blogId = blogId;
	if (index >= 0) {
		// 更新已有博客
		blogData[index].id = blogId;
		blogData[index].title = title.value;
		blogData[index].blogContent = detail.innerText;
		blogData[index].modifyTime = +new Date();
	} else {
		// 新增博客
		var blog = {
			id: blogId,
			title: title.value,
			blogContent: detail.innerText,
			allowView: -100,
			modifyTime: +new Date(),
			accessCount: 0,
			commentCount: 0,
			rank: 0
		};
		blogData.unshift(blog);
	}
	createBlogList(blogData);
}

/**
 * [deleteSelectedBlog 删除选中的博客]
 * @return null
 */
function deleteSelectedBlog() {
	var blogs = document.querySelectorAll(".blog-item");
	var len = blogs.length;
	for (var i = 0; i < len; i++) {
		if (blogs[i].children[0].checked) {
			blogData[i] = null;
		};
	}
	blogData = blogData.filter(function(blog) {
		return blog;
	});
	createBlogList(blogData);
}

/**
 * [deleteBlog 删除单条博客]
 * @param  {[type]} index
 * @return null
 */
function deleteBlog(index) {
	if (index >= 0) {
		blogData.splice(index, 1);
	} else {
		blogData.splice(index);
	}
	createBlogList(blogData);
}

/**
 * [stickBlog 置顶博客]
 * @param  {[type]} index
 * @return null
 */
function stickBlog(index) {
	if (index === undefined || index < 0) {
		return;
	}
	var rank = blogData[index].rank;
	blogData[index].rank = rank === 5 ? 0 : 5;
	blogData.unshift(blogData.splice(index, 1)[0]);
	createBlogList(blogData);
}

/**
 * [updateTitle 更新编辑区域的ID和index]
 * @return null
 */
function updateTitle() {
	var title = document.querySelector(".publish .title");
	var id = title.dataset.blogId;
	var index_new;
	var res = blogData.some(function(blog, index) {
		index_new = index;
		return blog.id == id;
	});
	if (res) {
		title.dataset.index = index_new;
	} else {
		title.dataset.index = -1;
		title.dataset.blogId = "";
	}
}

/**
 * [createBlogList 创建博客列表]
 * @param  {[array]} dataset 数据
 * @return null
 */
function createBlogList(dataset) {
	sortBlog(dataset);
	updateTitle(); // 每次创建列表都需要更新title以确保发布到正确的博客
	var list = document.querySelector(".manage .list");
	var len = dataset.length;
	if (!len) {
		// 没有博客数据
		var tip = document.createElement("div");
		tip.classList.add("empty-tip");
		tip.innerText = "主人很懒，什么都没有写，快去写点什么吧~~";
		list.innerHTML = '';
		list.appendChild(tip);
		return;
	}
	// 使用文档片段加快速度
	var blogs = document.createDocumentFragment();
	for (var i = 0; i < len; i++) {
		var blog = document.createElement("div");
		blog.classList.add("blog-item");
		blog.dataset.id = dataset[i].id;
		blog.style.zIndex = len - i;
		var time = formatDateTime(dataset[i].modifyTime);
		var isTop = dataset[i].rank === 0 ? '置顶' : '取消置顶';
		var html = '<input type="checkbox" />';
		html += '<div class="right"><div class="row"><div class="caption">';
		html += '<span class="' + (dataset[i].allowView < 0 ? 'public' : 'private') + '"></span>';
		html += '<span class="left">' + dataset[i].title + '</span>';
		html += '<div class="option menu-drop-light">' +
			'更多' +
			'<ul class="menu" data-index="' + i + '">' +
			'<li class="delete-blog">删除</li>' +
			'<li class="stick-blog">' + isTop + '</li>' +
			'</ul>' +
			'</div>' +
			'<span class="option edit-blog" data-index="' + i + '">编辑</span>' +
			'</div>' +
			'</div>';
		html += '<div class="row"><div class="infos">';
		html += '<span class="time">' + time + '</span>';
		html += '<span class="read">阅读' + dataset[i].accessCount + '</span>';
		html += '<span class="comment">评论' + dataset[i].commentCount + '</span>';
		html += '</div></div></div></div>';
		blog.innerHTML = html;
		blogs.appendChild(blog);
	}
	var select = document.createElement("div");
	select.classList.add("select-all");
	select.innerHTML = '<input type="checkbox" class="choose-all"/>' +
		'<span>全选</span>' +
		'<button class="delete-selected">删除</button>';
	blogs.appendChild(select);
	list.innerHTML = ''; // 清除已有列表
	list.appendChild(blogs);
}

/**
 * [formatDateTime 格式化时间]
 * @param  {[number]} date [时间]
 * @return {[string]}      [YYYY-MM--DD HH-MM]
 */
function formatDateTime(date) {
	date = new Date(date);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
}

/**
 * [sortBlog 对博客数据进行排序]
 * @param  {[array]} dataset
 * @return null
 */
function sortBlog(dataset) {
	dataset.sort(function(pre, next) {
		// 置顶的优先于未置顶的
		if (next.rank !== pre.rank) {
			return next.rank - pre.rank
		}
		// 按照时间排序
		return next.modifyTime - pre.modifyTime;
	});
}

/**
 * [createTags 生成标签]
 * @param  {[type]} dataset
 * @return null
 */
function createTags(dataset) {
	var len = dataset.length;
	var html = "";
	var tagOb = {};
	for (var i = 0; i < len; i++) {
		var tagNames = dataset[i].className;
		if (!tagNames) {
			continue;
		}
		var l = tagNames.length;
		for (var j = 0; j < l; j++) {
			if (tagOb[tagNames[j]]) {
				continue;
			}
			tagOb[tagNames[j]] = true;
			html += '<a class="tag-one" href="#">' + tagNames[j] + '</a>';
		}
	}
	var tagWrap = document.querySelector(".content .manage .tab-tag");
	if (html !== '') {
		tagWrap.innerHTML = html;
	} else {
		tagWrap.classList.add("no-tag");
	}
}

/**
 * [createLatestBlogList 创建最新博客列表]
 * @param  {[type]} dataset
 * @return null
 */
function createLatestBlogList(dataset) {
	latestBlogList.classList.remove("rolling");
	var len = latestBlogArray.length;
	var update_index = Math.floor(Math.random() * 5);
	if (len === 6) {
		// 清除最后一个博客
		latestBlogArray.pop();
	}
	// 在开头随机选择一个“新”博客
	latestBlogArray.unshift(update_index);
	len = latestBlogArray.length;
	var blogs = document.createDocumentFragment();
	for (var i = 0; i < len; i++) {
		var index = latestBlogArray[i];
		var blog = document.createElement("div");
		blog.classList.add("log-item");
		var html = '<div class="left"></div>';
		html += '<div class="right"><div class="row one"><a href="#">';
		html += dataset[index].title;
		html += '</a></div><div class="row two">';
		html += dataset[index].desc;
		html += '</div></div></div>';
		blog.innerHTML = html;
		blogs.appendChild(blog);
	}
	latestBlogList.innerHTML = '';
	latestBlogList.appendChild(blogs);
}

/**
 * [updateLatestBlog 更新最新博客]
 * @return null
 */
function updateLatestBlog() {
	if (shouldUpdateBlog) {
		latestBlogList.classList.add("rolling");
		setTimeout(function() {
			// 动画500ms，600ms后更新列表
			createLatestBlogList(latestBlogData);
		}, 600);
		// 不断更新
		setTimeout(updateLatestBlog, 2000);
	}
}

/**
 * [hashEncode hash编码]
 * @param  {[type]} str [博客内容]
 * @return {[string]}     [id]
 */
function hashEncode(str) {
	var _str = +new Date() + str; // 加入时间戳
	var len = _str.length;
	var count = (len / 8) ^ 0;
	var start = len % 8;

	var time33 = 5381; //Magic Constant
	while (start--) {
		time33 = (time33 << 5) + time33 + _str.charCodeAt(start);
	}
	while (count--) { // duff's device
		time33 = (time33 << 5) + time33 + _str.charCodeAt(--len);
		time33 = (time33 << 5) + time33 + _str.charCodeAt(--len);
		time33 = (time33 << 5) + time33 + _str.charCodeAt(--len);
		time33 = (time33 << 5) + time33 + _str.charCodeAt(--len);
		time33 = (time33 << 5) + time33 + _str.charCodeAt(--len);
		time33 = (time33 << 5) + time33 + _str.charCodeAt(--len);
		time33 = (time33 << 5) + time33 + _str.charCodeAt(--len);
		time33 = (time33 << 5) + time33 + _str.charCodeAt(--len);
	}
	return time33 & 0x7FFFFFFF + "";
}

/**
 * [setGreeting 设置问候语]
 */
function setGreeting() {
	var greeting = document.querySelector(".head .greeting");
	var time = (new Date()).getHours();
	if (time < 12) {
		greeting.innerText = "早上好，";
	} else if (time < 14) {
		greeting.innerText = "中午好，";
	} else if (time < 18) {
		greeting.innerText = "下午好，";
	} else if (time < 24) {
		greeting.innerText = "晚上好，";
	}
}
