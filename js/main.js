class PriceObject {
    render(){
        this.total = this.total.toString().replace(/(^\d{1,3}|\d{3})(?=(?:\d{3})+(?:$|\.))/g, '$1.')
        this.value = this.value.toString().replace(/(^\d{1,3}|\d{3})(?=(?:\d{3})+(?:$|\.))/g, '$1.')

        // let _qty = '<div class="numberCircle centerDiv">' + this.qty + '</div>'
        let _total = '<h3 style="margin:10px 0 0 0; font-size: 50px">   ' + this.total + ' / ' + this.qty + '</h3>'
        let _basePrice = '<p style="font-size: 35px">@' + this.value + '</p>'

        if(this.total === this.value) _basePrice = ""

        if(this.size === undefined)
            this.size = 12
        return '<div class="col-md-' + this.size + ' col-xs-' + this.size + ' text-center">' + _total + _basePrice + '</div>'
    }
}

$(document).ready(()=>{
    $("#sectionIncorrectBarcode").hide()
    $("#txtBarcode").focus()

    $("#frmSearch").submit((e)=>{
        e.preventDefault()

        barcode = $("#txtBarcode").val()
        $("#txtBarcode").val("")

        $.ajax({
            url: "http://192.168.1.88:55671/products/" + barcode,
            method: "get",
            success: function(res){
                $("#sectionDetailProduct").show()
                $("#sectionIncorrectBarcode").hide()

                var product = res.data[0]
                $("#txtProductName").text(product.name)
                $("#containerPrices").empty()
                
                var prices = []
                $.each(product.prices, (index, value)=>{
                    obj = new PriceObject()
                    obj.qty = value.minQty
                    obj.value = value.value
                    obj.total = value.minQty * value.value
                    if(obj.total > 0)
                        prices.push(obj)
                })

                $.each(prices, (index, value)=>{
                    // value.size = 12 / prices.length
                    $("#containerPrices").append(value.render())
                })

            },
            error: function(res){
                $("#sectionDetailProduct").hide()
                $("#sectionIncorrectBarcode").show()
            }
        })
    })
})