 // Print content object

var _EscCommand = (function () {
  function _EscCommand() {
      this.ESC = "\u001B";
      this.GS = "\u001D";
      this.LF = "\u000A";
      this.InitializePrinter = this.ESC + "@";
      this.UKCharSet = this.ESC + "R" + "\3"; //ESC R 3 for UK Char Set
      this.BoldOn = this.ESC + "E" + "\u0001";
      this.BoldOff = this.ESC + "E" + "\0";
      this.DoubleHeight = this.GS + "!" + "\u0001";
      this.DoubleWidth = this.GS + "!" + "\u0010";
      this.DoubleOn = this.GS + "!" + "\u0011"; // 2x sized text (double-high + double-wide)
      this.DoubleOff = this.GS + "!" + "\0";
      this.PrintAndFeedMaxLine = this.ESC + "J" + "\u00FF"; //
      this.TextAlignLeft = this.ESC + "a" + "0";
      this.TextAlignCenter = this.ESC + "a" + "1";
      this.TextAlignRight = this.ESC + "a" + "2";
      this.PartialCutPaper = this.GS+"V"+"1";
      this.FullCutPaper =  this.GS+"V"+"0";

  }
  _EscCommand.prototype.PrintAndFeedLine = function (verticalUnit) {
      if (verticalUnit > 255)
          verticalUnit = 255;
      if (verticalUnit < 0)
          verticalUnit = 0;
      return this.ESC + "J" + String.fromCharCode(verticalUnit);
  };
  _EscCommand.prototype.CutAndFeedLine = function (verticalUnit) {
      if (verticalUnit === void 0) {
          return this.GS + "V" + "1";
      }
      if (verticalUnit > 255)
          verticalUnit = 255;
      if (verticalUnit < 0)
          verticalUnit = 0;
      return this.GS + "V" + String.fromCharCode(verticalUnit);
  };
  return _EscCommand;
} ());


function conDevice(deviceId){
	var bt = new bluetooth(0);
	if(!bt.isEnabled()){	  bt.enable(); }
	if(bt.isconnected()) {
		alert("Printer is not reachable");
	}

	//if(!getStorage("bt_con_dev")){
    //	bt.connect(deviceId); 
    //$('#popupdevice ons-dialog').hide();
	//	setStorage("bt_con_dev",deviceId);
	//}
	var Esc = new _EscCommand();

	var pound = '\u0023'; //Hexadecimal code for printing £

	var print_cnt = res_copy=kit_copy='';
	for(var i=0;i<$("#order-details-item").children().length;i++){
		//alert($("#order-details-item").children().eq(i).html());
		if($("#order-details-item").children().eq(i).hasClass('header')) {
			if(i == ($("#order-details-item").children().length-1)) print_cnt += "------- ----------------------- --------\n";
			print_cnt += Esc.DoubleWidth + $("#order-details-item").children().eq(i).find('.ons-col-inner').html();
			if(typeof $("#order-details-item").children().eq(i).find('.text-right').html() != "undefined") {
				print_cnt += "        "+Esc.DoubleWidth+Esc.UKCharSet+pound+$("#order-details-item").children().eq(i).find('.text-right').html().substr(1);
			}
			print_cnt += Esc.DoubleOff+"\n";
			if(i == 0) print_cnt += "\n";
		}

		if($("#order-details-item").children().eq(i).hasClass('list__item')) {
			if($("#order-details-item").children().eq(i).find('.row ons-col').hasClass('fixed-col')){
				var str = $("#order-details-item").children().eq(i).find('.row .fixed-col').html();
				result = str.replace(/.{20}\S*\s+/g, "$&@").split(/\s+@/);
				/*var chr = $("#order-details-item").children().eq(i).find('.row .undefined').html().length;
			var tol_space = '';
			for(var j=0;j<(30-result.join("\n").length);j++){
				tol_space +=space;
			}*/
			var tol_space = 32 -(result.join("\n").length);
			var empty_space = ' ', tol_spaces='';
			//alert(result.join("\n").length);
			if(result.join("\n").length >= 22){
					var newresult = str.replace(/.{20}\S*\s+/g, "$&@").split(/\s+@/);
					tol_space = 32 -$(newresult).last()[0].length;
			}
			
			for(var j=0;j<tol_space;j++){
				tol_spaces +=empty_space;
			}
				//alert(result.join("\n"));
				//alert($("#order-details-item").children().eq(i).find('.row .text-right').html().substr(1));
			print_cnt += Esc.TextAlignLeft +result.join("\n")+tol_spaces+ Esc.TextAlignRight  + Esc.UKCharSet+ pound + $("#order-details-item").children().eq(i).find('.row .text-right').html().substr(1)+"\n";

			var str= $("#order-details-item").children().eq(i).find('.row .fixed-col').html();
			str = str.split(' ');
			str[0] = str[0].replace("x",'');
			str.splice(1, 1);

			kit_copy += Esc.TextAlignLeft+Esc.DoubleWidth +str.join(" ") +Esc.DoubleOff +"\n\n";
			//kit_copy += Esc.TextAlignLeft+Esc.DoubleWidth +$("#order-details-item").children().eq(i).find('.row .fixed-col').html()+Esc.DoubleOff +"\n\n";
			}

			if($("#order-details-item").children().eq(i).find('.row ons-col').hasClass('undefined')){
			var space = " ";
			var chr = $("#order-details-item").children().eq(i).find('.row .undefined').html().length;

			var tol_space = 32 -($("#order-details-item").children().eq(i).find('.row .undefined').html().length);
			var empty_space = ' ', tol_spaces='';
			for(var j=0;j<tol_space;j++){
				tol_spaces +=empty_space;
			}
			print_cnt += Esc.TextAlignLeft +$("#order-details-item").children().eq(i).find('.row .undefined').html()+tol_spaces+ Esc.TextAlignRight  + Esc.UKCharSet+ pound + $("#order-details-item").children().eq(i).find('.row .text-right').html().substr(1)+"\n";
			}
		}

	}

	for(var i=0;i<$("#order-details").children().length;i++){
		if($("#order-details").children().eq(i).hasClass('header')) {
			res_copy += Esc.TextAlignCenter + Esc.DoubleOn + $("#order-details").children().eq(i).find('.text-right').html()+ Esc.DoubleOff +"\n";
			res_copy += Esc.TextAlignCenter + "Order Type : "+ $("#order-details").children().eq(4).find('.row .text-right').html()+"\n";
			res_copy += "------- ----------------------- --------\n";
			res_copy += Esc.TextAlignLeft +"Date   "+"              " + Esc.TextAlignRight + $("#order-details").children().eq(6).find('.text-right').text()+"\n";
			res_copy += Esc.TextAlignLeft +"Time   "+"              " + Esc.TextAlignRight + $("#order-details").children().eq(7).find('.text-right').text()+"\n";
		}

		if($("#order-details").children().eq(i).hasClass('list__item')) {
			if(i ==1)
			res_copy += Esc.TextAlignLeft +"Name   "+"             " + Esc.TextAlignRight + $("#order-details").children().eq(i).text()+"\n";
			if(i ==2)
			res_copy += Esc.TextAlignLeft +"Phone  "+"             " + Esc.TextAlignRight + $("#order-details").children().eq(i).text()+"\n";
			if(i ==3)
			res_copy += Esc.TextAlignLeft +"Deliver to -> \n"+ $("#order-details").children().eq(i).find('.fixed-col').text()+"\n";
		}
	}


	if($("#order-details").children().eq(5).find('.row .text-right').html() == "COD"){
		res_copy_pay = Esc.DoubleOn +Esc.TextAlignCenter+"CASH ON DELIVERY!\n" + Esc.DoubleOff;
	}else{
		res_copy_pay = Esc.DoubleOn +Esc.TextAlignCenter+ "  PAID\n" + Esc.DoubleOff;
	}


	var m_dtl = JSON.parse( getStorage("merchant_info") );

	var res_footer = "\nThank you for ordering with Cuisine.je\nFor enquiries on your order,please contact "+m_dtl.restaurant_name+".";

	var merchant_details = '------- ----------------------- --------\n'+Esc.TextAlignCenter + Esc.DoubleOn + m_dtl.restaurant_name+ Esc.DoubleOff +"\n\n"+Esc.TextAlignCenter+m_dtl.street+" "+m_dtl.city+"\n"+Esc.TextAlignCenter+m_dtl.state+" "+m_dtl.post_code+"\n"+Esc.TextAlignCenter+"Phone : "+m_dtl.restaurant_phone+"\n"+Esc.TextAlignCenter+m_dtl.restaurant_slug+"\n\n"+Esc.TextAlignCenter + Esc.DoubleOn + "CUSTOMER COPY"+ Esc.DoubleOff +"\n\n"+ res_copy+"\n";
	var print_dtl = Esc.InitializePrinter +Esc.DoubleOn+ Esc.TextAlignCenter +"Cuisine.je\n\n" + Esc.DoubleOff + merchant_details+"\n\n"+ print_cnt + res_footer+ Esc.PrintAndFeedMaxLine +  Esc.LF + Esc.PartialCutPaper + Esc.LF;

	print_dtl += Esc.InitializePrinter + Esc.DoubleOn+Esc.TextAlignCenter+"RESTAURANT COPY\n\n" + Esc.DoubleOff + res_copy+"\n------- ----------------------- --------\n"+print_cnt+"\n------- ----------------------- --------\n"+res_copy_pay + Esc.PrintAndFeedMaxLine + Esc.LF  +  Esc.PartialCutPaper+Esc.LF;

	var kit_dtl = Esc.TextAlignCenter + $("#order-details").children().eq(0).find('.text-right').html()+"\n"+Esc.TextAlignLeft +"Customer Name:"+ $("#order-details").children().eq(1).text()+"\n------- ----------------------- --------\n";

	print_dtl += Esc.InitializePrinter+Esc.DoubleOn+Esc.TextAlignCenter+"Kitchen COPY\n" + Esc.DoubleOff +kit_dtl + kit_copy +"\n\n"+ Esc.PrintAndFeedMaxLine + Esc.LF + Esc.FullCutPaper+Esc.LF;
	
	//setTimeout(function(){
	var uint8array = new TextEncoder('utf-8', { NONSTANDARD_allowLegacyEncoding: true }).encode(print_dtl);
     bt.write(uint8array.buffer, deviceId);	
	
	//},2000);

	setTimeout(function(){window.location.reload();},2000);
}

