pragma solidity ^0.4.25;

contract CloudFactory{
    address[] public deployedContracts;
    
     event contractAddr(address addr);
    
    function createContract(uint256 expectedPrice,uint128 repeat,uint256 size,uint256 day) public  {
        address newContract= address(new Cloud(msg.sender,expectedPrice,repeat,size,day));     
        deployedContracts.push(newContract);
        emit contractAddr(newContract);
       
    }
    
    function getContracts() public view returns(address[] memory){
        return deployedContracts;
    }
}

contract Cloud {
    struct Tenant {
        address id;
        uint256 price;
        uint128 replication;
        uint256 data_required;
        uint256 day;
        uint256 total_data_d2rep;
        
        
    }
    
    struct Renter {
        address id;
        uint256 dataSize;
        uint256 price;
        uint256 costPerDay;
    }
    
    struct StoreLord {
        uint256 rent;
        uint256 [] transactions;
        uint256 transcDone;
        
    }
    Tenant public tenant ;
    Renter [] public renter;
    address[] public renters;
    address [] public winnerrenters;
    uint256 public totalCost=0;
    mapping(address=>StoreLord) public storelords;
    mapping(address=>uint256) public renterPrice;
    mapping(address=>uint256) public renterSize;
    bool public gotWinners=false;
    bool public gotRent=false;
    
    function Cloud(address id,uint256 price,uint128 repeat,uint256 size,uint256 day) public {
         tenant.id=id;
         tenant.data_required=size;
         tenant.replication=repeat;
         tenant.total_data_d2rep=size*repeat;
         tenant.day=day;
         tenant.price=price;
    }
    
    function giveRent() public payable {
        gotRent=true;
    }
    
    function balance() public view returns(uint256) {
        return address(this).balance;
    }
    
    function getRenters() public view returns(address []) {
        return renters;
    }
    function getWinners() public view returns(address []){
        return winnerrenters;
    }
    
    function addRenter(uint256 size,uint price) public {
        if(msg.sender==tenant.id) {
            return;
        }
        Renter memory newRenter;
        newRenter.id=msg.sender;
        newRenter.dataSize=size;
        newRenter.price=price;
        newRenter.costPerDay=price/size;
        renter.push(newRenter);
        renters.push(msg.sender);
        renterSize[msg.sender]=size;
        renterPrice[msg.sender]=price;
        
    }
    
    function getRenterLength() public view returns(uint256) {
        return renter.length;
    }
    
    function quickSort(int left, int right) internal{
        int i = left;
        int j = right;
        if(i==j) return;
        int itr;
        uint256 prev=renter[uint(left)].costPerDay;
        int sorted=1;
        for(itr=left+1;itr<=right;itr++)
        {
            if(prev>renter[uint(itr)].costPerDay)
            {
                sorted=0;
                break;
            }
        }
        if(sorted==1)
            return;
        uint256 pivot = renter[uint((left + right) / 2)].costPerDay;
        while (i <= j) {
            while (renter[uint(i)].costPerDay < pivot) i++;
            while (pivot < renter[uint(j)].costPerDay) j--;
            if (i <= j) {
                Renter memory temp;
                temp.id=renter[uint(i)].id;
                temp.dataSize=renter[uint(i)].dataSize;
                temp.price=renter[uint(i)].price;
                temp.costPerDay=renter[uint(i)].costPerDay;
                renter[uint(i)].id=renter[uint(j)].id;
                renter[uint(i)].dataSize=renter[uint(j)].dataSize;
                renter[uint(i)].price=renter[uint(j)].price;
                renter[uint(i)].costPerDay=renter[uint(j)].costPerDay;
                renter[uint(j)].id=temp.id;
                renter[uint(j)].dataSize=temp.dataSize;
                renter[uint(j)].price=temp.price;
                renter[uint(j)].costPerDay=temp.costPerDay;
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(left, j);
        if (i < right)
            quickSort(i, right);
    }
    
    function findcost(uint256 data_needed) internal view returns(uint256){
        quickSort(0,int(renter.length-1));
        uint i;
        uint256 cost=0;
        uint allocated=0;
        uint n=renter.length;
        for(i=0;i<n;i++)
        {
            if(data_needed<=(allocated+renter[i].dataSize))
            {
                cost+=renter[i].costPerDay*(data_needed-allocated);
                allocated=data_needed;
                break;
            }
            else
            {
                cost+=renter[i].price;
                allocated+=renter[i].dataSize;
            }
        }
        if(allocated<data_needed)
        {
            // not possible to allocate
            return 0;
        }
        return cost;
    }
    event winner_event(bool got);
    function findTheWinner() public {
    
        if(msg.sender !=tenant.id){
            emit winner_event(false);
            return;
        }
        uint256 cost=findcost(tenant.total_data_d2rep);
        if(cost==0)
        {
            emit winner_event(false);
            return;
        }
        totalCost=cost*tenant.day;
        uint i;
        uint requirement=tenant.total_data_d2rep;
        uint allocated=0;
        uint costincurred=0;
        uint n=renter.length;
        for(i=0;i<n;i++) //assuming we have enough data to fulfill the request
        {
            if(requirement<=(allocated+renter[i].dataSize))
            {
                StoreLord memory newslterm;
                newslterm.rent=renter[i].costPerDay*(requirement-allocated);
                newslterm.transcDone=0;
                newslterm.transactions= new uint256 [](1);
                newslterm.transactions[0]=now;
                winnerrenters.push(renter[i].id);
                storelords[renter[i].id]=newslterm;
                renter[i].dataSize-=requirement-allocated;
                allocated=requirement;
                costincurred+=newslterm.rent;
                break;
            }
            else
            {
                StoreLord memory newsl;
                newsl.rent=renter[i].costPerDay*renter[i].dataSize;
                newsl.transcDone=0;
                newsl.transactions= new uint256 [](1);
                newsl.transactions[0]=now;
                winnerrenters.push(renter[i].id);
                storelords[renter[i].id]=newsl;
                allocated+=renter[i].dataSize;
                costincurred+=newsl.rent;
                renter[i].dataSize=0;
            }
        }
        gotWinners=true;
        emit winner_event(true);
    }
    
    
    function checking() public payable {
         uint currentTime=now;
         if(storelords[msg.sender].rent==0){
             revert();
         }
         uint lastTranscDone=storelords[msg.sender].transactions[storelords[msg.sender].transcDone];
         uint amt=storelords[msg.sender].rent;
         amt=amt*1000000000000000000;
         lastTranscDone=lastTranscDone+60;
         if(currentTime>=lastTranscDone){
         (msg.sender).transfer(amt);
         storelords[msg.sender].transactions.push(now);
         storelords[msg.sender].transcDone=storelords[msg.sender].transcDone+1;
         }
         else {
             revert();
         }
    }
    
}