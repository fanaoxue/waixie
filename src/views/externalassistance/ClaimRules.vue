<template>
  <div class="claim_rules_container">
    <c-header>
      <van-nav-bar
        title="理赔规则"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <h3 style="text-align:center">路歌无车承运保出险理赔须知</h3>
        <h5 style="text-align:right;color:red;">
          协议号：PYAE201 864020000000 019
        </h5>
        <span style="font-weight:bold;">一．出险阶段</span>
        <div>
          <p>
            <span style="font-weight:bold;">1.单车事故：</span
            >出险后，请司机（现场人员）在确保人身安全的前提下及时拨打人保客服电话：0951-95518，告知客服保单协议号、出险时间、地点、货物名称，简单描述出险过程，要求人保安排查勘人员现场查勘。报险电话完毕后，请维护好现场，保持手机畅通，等待查勘员联系确认（如果半小时内没有查勘员联系请再次致电人保客服加急）。现场人员请自行用手机拍摄出险现场照片留存，照片内容含有出险车头、车尾、整车照片和部分可视的受损细节照片。如果是盗窃抢劫案件，请务必同时拨打110完成立案。
          </p>
          <p>
            <span style="font-weight:bold;">2.多车事故：</span
            >发生涉及其他车辆交通事故后，在确保现场人员安全前提下及时电话报警：122，随后拨打人保客服电话：0951-95518，告知客服保单协议号、出险时间、地点、货物名称，简单描述出险过程，要求人保安排查勘人员现场查勘。报险电话完毕后，请维护好现场，保持手机畅通，等待查勘员联系确认（如果半小时内没有查勘员联系请再次致电人保客服加急）。现场人员请自行用手机拍摄出险现场照片留存，照片内容含有出险双方（多方）车头、车尾、整车照片和部分可视的受损细节照片。多车事故出险需掌握对方车辆人员联系方式，获取交警责任认定书，按交警责任划分向对方<span
              style="color:red;"
              >车险（第三者）</span
            >索赔责任认定书划分给<span style="color:red;">对方责任比例</span
            >的货物损失，人保承担己方责任比例的损失。
          </p>
        </div>
        <span style="font-weight:bold;">二．索赔阶段</span>
        <div>
          <p style="text-indent:2em;">
            报险操作完毕后，请和路歌保险部货运险理赔同志联系（如夜间可次日联系），告知详细出险情况和预计损失情况。联系电话：18655989056
            吴昉。由理赔同志协助处理索赔流程，与保险公司沟通相关理赔信息细节。
          </p>
          <p style="text-indent:2em;">
            出险报案后即可准备以下索赔材料（如有不确认处可与理赔同志联系）：
          </p>
          <p style="font-weight:bold;">
            1、随车清单、运单（含运输货物信息、车辆牌照信息）
          </p>
          <p style="font-weight:bold;">2、运输协议（货主或厂家）</p>
          <p style="font-weight:bold;">
            3、货物价值证明（发票、采购合同、厂家盖章证明）
          </p>
          <p style="font-weight:bold;">4、厂家维修费用清单或损失证明（盖章）</p>
          <p style="font-weight:bold;">
            5、赔付证明（赔付货主或者厂家的银行流水或者收款方提供的相关发票、盖章证明）
          </p>
          <p style="font-weight:bold;">
            6、司机的驾驶证正副页、出险车辆行驶证正副页（挂车行驶证正副页）、司机身份证、司机营运证等相关证件的复印件（内河运输出险提供相关船只、船长信息）
          </p>
          <p style="font-weight:bold;">7、出险通知书</p>
          <p style="font-weight:bold;">8、出险清单</p>
          <p style="font-weight:bold;">9、客户信息补充单</p>
          <p style="font-weight:bold;">10、赔偿申请告知函</p>
          <p style="font-weight:bold;">11、权益转让书</p>
          <p style="font-weight:bold;">
            12、转账授权委托书<span style="color:red"
              >（7-12项格式文本由路歌保险部提供）</span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'claim_rules',
  data() {
    return {}
  },
  created() {
    // this.$store.commit('updateLoadingStatus', { isLoading: false })
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
.claim_rules_container {
  .content {
    padding: 10px;
  }
  @media screen and (max-width: 320px) {
    font-size: 15px;
  }
}
</style>
