<template>
    <div style="height: 100vh">
        <el-container>
			<el-header>
			    <div>
			        <el-row :gutter="20">
			            <el-col :xl="2" :lg="2" :md="2" :sm="2" :xs="2">
			                <div style="line-height: 56px;text-align: left;font-size: 25px;">
			                    <img src="../../assets/logo3.png" width="120px" style="margin-top:5px" />
			                </div>
			            </el-col>
			
			            <el-col :xl="12" :lg="12" :md="12" :sm="12" :xs="14">
			                <div style="font-size: 30px;line-height: 56px;padding-left: 40px;font-size: 25px;">
								<i class="iconFamily myiconindent" @click="status(true)" v-if="menu.isCollapse" style="font-size: 25px;"></i>
								<i class="iconFamily myiconoutdent" @click="status(false)" v-else style="font-size: 25px;"></i>
			                </div>
			            </el-col>
			            <el-col :xl="10" :lg="10" :md="10" :sm="10" :xs="10">
			                <div style="text-align: right;line-height: 56px;margin-top: 5px">
                                <el-avatar @click.native="command('info')" alt="" :size="45" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
			                    <!--<el-dropdown @command="command">  &lt;!&ndash; @command="command" 点击菜单项触发的事件回调 返回 dropdown-item 的指令 &ndash;&gt;
			                        <span class="el-dropdown-link"  style="line-height: 0px ;color: #ffffff;">
			                            <i class="el-icon-s-custom"></i>个人设置
			                            <el-dropdown-menu slot="dropdown">
			                                <el-dropdown-item icon="el-icon-user" command="info">个人中心</el-dropdown-item> &lt;!&ndash; command="info" 指令  意思是:标记  &ndash;&gt;
			                            </el-dropdown-menu>
			                        </span>
			                    </el-dropdown>-->
			                </div>
			            </el-col>
			        </el-row>
			    </div>
			</el-header>
            

            <!--内容区-->
            <el-container>
                <!-- 头部 -->
                <!-- 导航区 -->
                <el-aside :style="{'width':menu.aSideWidth,'border':'0px','transition':'all 0.001s ease','marginLeft':'-8px'}">
                    <!-- 菜单声明
                        collapse : 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
                        unique-opened : 是否只保持一个子菜单的展开
                        collapse-transition : 是否开启折叠动画
                        background-color="#324057" 菜单的背景色
                        text-color="#fff" 菜单的文字颜色
                        active-text-color : 当前激活菜单的文字颜色
                        :default-active="defaultActive" 当前激活菜单的 index
                        @select="menuSelect" 菜单激活回调, index: 选中菜单项的 index, indexPath: 选中菜单项的 index path
                    -->
                    <el-menu
                            class="el-menu-vertical-demo bigmenu"
                            :collapse="menu.isCollapse"
                            unique-opened
                            collapse-transition
                            background-color="#324057"
                            text-color="#fff"
                            active-text-color="blue"
                            :default-active="menu.defaultActive"
                            @select="menuSelect"
                    >
                        <!--
                            :index="item.name" 菜单的唯一标识
                            :key="item.name" 循环的唯一标识
                            v-for="item in computed_menu" 循环处理后的totalMenu数据computed_menu
                        -->
                        <el-submenu :index="item.name" :key="item.name" v-for="item in computed_menu">
                            <template slot="title">
                                <i :class="item.meta.icon"></i> <!--父菜单的图标-->
                                <span slot="title">{{item.meta.title}}</span><!-- 父菜单的名称 -->
                            </template>
                            <!--
                                :route="item.path + '/' + child.path"  Vue Router 路径对象 : /parent1/aa
                            -->
                            <el-menu-item :index="child.name"  :key="child.name" v-for="child in item.children" :route="item.path + '/' + child.path"  @click="addTab(child)">
                                <i :class="child.meta.icon"></i>{{child.meta.title}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <!-- 正式内容区 -->
                <el-main style="padding: 0px;margin: 0px;">
                    <div class="mycard">
                        <!--
                            v-model="tabs.editableTabsValue" 绑定值，选中选项卡的 name
                            type="card" 风格类型 可选值: card/border-card
                            closeable 标签是否可关闭
                            tab-remove="removeTab" 点击 tab 移除按钮后触发 返回被删除的标签的 name
                            @tab-click="onClickTab" tab 被选中时触发,返回被选中的标签 tab 实例
                        -->
                        <el-tabs class="eltabs" v-model="tabs.editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="onClickTab" >
                            <el-tab-pane :key="item.name" v-for="item in tabs.editableTabs" :label="item.title" :name="item.name"></el-tab-pane>
                        </el-tabs>
                    </div>
                   <!-- <el-divider content-position="left"><i class="el-icon-trophy"></i> 嘉奖</el-divider>
                    <el-row>
                        <el-col :span="8">
                            <div style="text-align: center;margin: 10px">
                                <img src="../../assets/logo1.png" alt="" width="200px" height="180px">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: center;margin: 10px">
                                <img src="../../assets/logo1.png" alt="" width="200px" height="180px">
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: center;margin: 10px">
                                <img src="../../assets/logo1.png" alt="" width="200px" height="180px">
                            </div>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="6">
                            <div style="text-align: center;margin: 10px">
                                <img src="../../assets/logo1.png" alt="" width="200px" height="180px">
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div style="text-align: center;margin: 10px">
                                <img src="../../assets/logo1.png" alt="" width="200px" height="180px">
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div style="text-align: center;margin: 10px">
                                <img src="../../assets/logo1.png" alt="" width="200px" height="180px">
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div style="text-align: center;margin: 10px">
                                <img src="../../assets/logo1.png" alt="" width="200px" height="180px">
                            </div>
                        </el-col>
                    </el-row>

                    <el-divider content-position="left" style="margin-top: 20px"><i class="el-icon-medal-1"></i> 人数统计</el-divider>
                    <el-divider content-position="left" style="margin-top: 20px"><i class="el-icon-moon-night"></i> 题量统计</el-divider>-->
<!--                    <center style="margin-top: 250px">-->
<!--                        <img src="../../assets/logo1.png" alt="">-->
<!--                    </center>-->

                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
        <user-info ref="userInfo"></user-info>
    </div>
</template>

<script>
    export default {
        name: "index",
        components:{
            UserInfo:()=>import("@/components/layout/user-info.vue")
        },
        data(){
            return {
                menu:{
                    aSideWidth:"220px", //左侧菜单的宽度
                    isCollapse:false, //是否水平折叠收起菜单
                    defaultActive:'home',//当前激活菜单的 name
                    mSelect:'home', //选中的菜单name
                    totalMenu:[], //父菜单集合
                    childMenu: [] //子菜单集合
                },
                storeMenu:[], //vuex中菜单权限集合
                tabs:{
                    editableTabsValue:'home',//当前默认选中的标签页的name
                    editableTabs:[ //选项卡集合   初始化首页数据
                        {
                            title:'首页',
                            name:'home',
                            content:''
                        }
                    ],
                    countTab:0, //删除标签页时计数器
                    confirmTab:0 ,//当前删除标签页的记录数
                    tabArray:["home"], //自定义选项卡集合,用于添加或删除选项卡时的一个标记, 保存标签页的每一个对象的名字
                }
            }
        },
        methods:{
            menuSelect(index,indexPath){ //菜单激活的回调,用于记录当前选中的菜单index
                this.menu.mSelect = index;
            },
            status(bool){ //左菜单显示和隐藏
                if(!bool){
                    this.menu.aSideWidth = '56px';
                }else {
                    this.menu.aSideWidth = "220px";
                }
                this.menu.isCollapse = !bool;
            },
            command(commandName){
                switch (commandName) {
                    case 'info':
                        this.$refs['userInfo'].value = true;
                        break;
                }
            },
            addTab(tab){
                if(this.tabs.tabArray.indexOf(tab.name) == -1){ //不存在则添加
                    this.tabs.editableTabs.push({ //选项卡集合中加入该选项卡
                        title:tab.meta.title,
                        name:tab.name,
                        content:tab.name
                    });
                    this.tabs.tabArray.push(tab.name); //自定义选项卡集合中添加当前选项卡的名称
                }
                this.tabs.editableTabsValue = tab.name; //重新给当前默认选中的选项卡的name赋值
                this.$router.push({name:tab.name}); //跳转到当前选项卡的视图页面
            },
            onClickTab(val){ //点击标签页触发
                //跳转页面视图
                this.$router.push({
                    name : val.name
                });

                //选中当前选项卡时,相应菜单也被选中
                this.menu.defaultActive = val.name;

                //重新给选中的菜单name赋值
                this.menu.mSelect = val.name;
            },
            removeTab(targetName){ //targetName 被删除的选项卡的 name
                let tabs = this.tabs.editableTabs;
                if(this.menu.mSelect.trim() == targetName.trim()){ //把当前选中的菜单title和要关闭的选项卡name做比较
                    //如果进入这个if,则说明点击删除时,当前页面就在要删除的选项卡集合中
                    tabs.forEach(item=>{
                        this.tabs.countTab ++ ; //删除标签页时计数器 + 1
                        if(item.name == targetName.trim()){ //如果当前选项卡集合中的被遍历的name与被删除的选项卡name相同,则说明有这个数据,
                            this.tabs.confirmTab = this.tabs.countTab; //则 把删除选项卡页时计数器的值赋值给当前删除标签页的记录数
                        }
                    });

                    //判断是否是删除的最后一个选项卡,如果是最后一个,则在删除最后一个后,默认选中最后一个
                    if(tabs.length == this.tabs.confirmTab){
                        this.$router.push({name:tabs[this.tabs.confirmTab - 2 ].name}); //跳转到当前选中菜单的视图

                        this.menu.mSelect = tabs[this.tabs.confirmTab - 2 ].name;//重新赋值当前选中的菜单name

                        this.tabs.editableTabsValue = tabs[this.tabs.confirmTab - 2 ].name; //重新赋值当前默认选中的标签页的name

                        this.menu.defaultActive = tabs[this.tabs.confirmTab - 2 ].name; //重新赋值当前激活菜单的 name

                    }else{ //如果删除的选项卡不是最后一个,则在删除当前选项卡后,选中的选项卡右移
                        this.$router.push({
                            name:tabs[this.tabs.confirmTab].name
                        });
                        this.menu.mSelect = tabs[this.tabs.confirmTab].name;
                        this.tabs.editableTabsValue = tabs[this.tabs.confirmTab].name;
                        this.menu.defaultActive = tabs[this.tabs.confirmTab].name;
                    }
                }

                //把要删除的标签页的name从自定义保存选项卡页name的数组中删除
                this.tabs.tabArray = this.tabs.tabArray.filter(item=> item != targetName);

                //页面上的数组也要删除
                tabs = tabs.filter(tab => tab.name != targetName);

                this.tabs.editableTabs = tabs;

                //清空计数器
                this.tabs.countTab = 0;
                this.tabs.confirmTab = 0;
            }
        },
        computed:{
          computed_menu(){  //剔除没有子菜单的父菜单,以及hideInMenu为true的父菜单,子菜单
             //根据不同用户显示不同菜单
             let arr = [];
             let subArr = [];
             //遍历全部路由
             this.menu.totalMenu.forEach(item=>{
                 //剔除无子级和hideInmenu==false的菜单
                 if(item.meta.hideInMenu == false && item.children != null){
                    if(this.storeMenu.indexOf(item.name) != -1){
                        subArr = [];
                        item.children.forEach(subitem =>{
                            if(subitem.meta.hideInMenu == false && this.storeMenu.indexOf(subitem.name)!=-1){
                                subArr.push(subitem);
                            }
                        });
                        item.children = subArr;
                        arr.push(item);
                    }
                 }
             });
              return arr;
          }
        },
        created() {
            this.$router.push({name:'home'});
            //获得全部路由集合
            this.menu.totalMenu=this.$router.options.routes;
            //获得vuex中用户的菜单权限集合
            this.storeMenu = this.$store.state.user.access.roles.menus;

        }
    }
</script>

<style>
	.el-menu-item {
		background-color: #2d3a4b !important;
	}
    /* 设置左菜单选中的菜单的背景颜色 */
    .el-menu-item.is-active {
        color: #fff!important;
        background-color: #1890ff!important;
    }
    /* 首页选项卡没有关闭按钮 */
    .el-tabs__nav .el-tabs__item:nth-child(1) span{
        display: none;
    }
    /* 所有的选项卡的间距设置 */
    .el-tabs__nav .el-tabs__item:nth-child(n){
        margin:3px!important;
        border: #ACD6FF 1px solid!important;
    }
    /* 选项卡样式设置 */
	
	.el-tabs--card > .el-tabs__header {
		border-bottom: 0px solid #e4e7ed !important;
	}
	.el-tabs__header {
		padding: 0;
		position: relative;
		margin: 0 0 3px !important;
	}
    .el-tabs__item{
        padding: 0 10px!important;
        box-sizing: border-box!important;
        height: 30px!important;
        line-height: 30px!important;
        display: inline-block!important;
        list-style: none!important;
        font-size: 14px!important;
        font-weight: 500!important;
        color: #303133!important;
        position: relative!important;
        margin: 0px!important;
    }
    /* 选项卡选中时的背景颜色 */
    .el-tabs__item.is-active{
        background-color: #ACD6FF;
    }
    /* 选项卡中前面的白圆圈 */
    .el-tabs__item.is-active:before{
        content: '';
        background: #fff;
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: relative;
        margin-right: 4px;
    }

    /* 标签页样式改变其行高 */
    .eltabs{
        width: 100%;
        line-height: 0px;
    }

    /* 布局 */
    .tram{
        border: 0px;
        transition:all 0.5s ease;
    }
    /* 左菜单样式--及动画 */
    .bigmenu{
        border: 0px;
        transition:all 0.001s ease;
        margin-left: -8px;
    }
    .iconFamily{
        font-size:22px;
    }
    /* 整个页面的高度 */
    .layout{
        height: 100vh;
    }
    /* 左侧样式 */
    .el-aside {
        background-color: #2d3a4b;
        text-align: left;
        line-height: 200px;
        height: 94vh;
    }
    /* 中间样式 */
    .el-main {
        background-color: #ffffff;
        color: #333;

    }
    /* 头部和尾部样式 */
    .el-header, .el-footer {
        background-color: #324157;
        color: #ffffff;
        line-height: 56px;
        height:  6vh !important;/*56px!important;*/
        border-bottom:0.5px solid rgba(0, 0, 0, 0.19);
    }
    /* 选项卡的阴影 */
    .mycard{
        width: 100%;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
    }
</style>