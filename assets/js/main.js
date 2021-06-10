
    const URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json';

    let xhr = new XMLHttpRequest();

    xhr.open('GET', URL);

    xhr.onload = function(){

        let data = JSON.parse(xhr.responseText);

        console.log(data);

        let currentDate= new Date();
        currentDate = currentDate.toLocaleDateString().split('.').reverse().join('-');
        console.log(currentDate);


        let debt = 0;
        let listOfDebts=[];

        
       
        for (item of data){
            if (item.attraction <= 0){
                continue;
            }

            //23.05.2020 ->2020-05-23
            item.repaydate = item.repaydate.split('.').reverse().join('-');
            item.paydate = item.paydate.split('.').reverse().join('-');

           let date = item.repaydate;

            if (date <= currentDate){
                continue;

            }

            item.attraction = +item.attraction;

            if (item.valcode == 'EUR'){
                item.attraction = +(item.attraction) *33;
            };
            
            if (item.valcode == 'USD'){
                item.attraction = +(item.attraction)* 28;
            }

            listOfDebts.push(item);
            
            debt+= item.attraction;

        }

        console.log(`Гос. долг Украниы ${debt/1_000_000} млн. грн`);
        console.log(listOfDebts);
        console.log(`listOfDebts ${listOfDebts[0].repaydate}`);

        listOfDebts=listOfDebts.map(item => ({
            sum: item.attraction,
            paydate: item.paydate,
            repaydate: item.repaydate //валюту не пишу, т.к. уже в прошлом цикле перевели в грн

        })  );

        listOfDebts.sort(function(a,b){
            if (a.repaydate>b.repaydate){
                return 1;
            }

            if (a.repaydate<b.repaydate){
                return -1;
            }

            
                return 0;
            

            
        });

        let sumOfRepaydate=0;
        let accSum=listOfDebts[0].sum;
        let arr = [];


        for (let i=0; i<(listOfDebts.length-1); i++ ){
            if (listOfDebts[i].repaydate == listOfDebts[i+1].repaydate){
                
                accSum = accSum + +listOfDebts[i+1].sum;

                
                //console.log(accSum);


                
            } else {
                sumOfRepaydate =accSum;
                arr.push({ 
                    sumPerDay: sumOfRepaydate=sumOfRepaydate.toFixed(2),
                    repaydate: listOfDebts[i].repaydate,
                    paydate: listOfDebts[i].paydate
                });
                accSum=listOfDebts[i+1].sum;
                //console.log(sumOfRepaydate );
               // console.log(accSum );
               // console.log(arr);

                
            }


           
            
        }


        

        function getListContent() {
            let result = [];
          
            for(let i=0; i<arr.length; i++) {
              let div = document.createElement('div');
              div.append(i);
              result.push(`Дата выплаты ${arr[i].repaydate}. Сумма выплаты ${arr[i].sumPerDay}`);
            }
          
            return result;
        }
          
          resBigTable.append(...getListContent()); 

       

      

      
       

        //resBigTable.innerHTML=`Дата выплаты.${arr.repaydate}. Сумма выплаты ${arr.sumPerDay}`;
        
       

       

        console.log(listOfDebts);
        console.log(arr);
        



        

        /* Далее, в этой функции, вам доступна переменная data с загруженными данными */

        /* Конец функции обработки события загрузки данных */
    }

    xhr.send();



  