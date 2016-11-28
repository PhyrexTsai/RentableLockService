pragma solidity ^0.4.2;

contract RentableLockService {
    // 付押金使用 lock 的人
    // 也就是這段時間可以使用 lock 的人
    address public renter;
    
    // 當租用時，最久租到何時
    // 押金為 0.01以太幣 可租用 1秒
    // 根據 msg.value 在 rent 時的多寡而不同
    uint public endTime;
    
    // 鎖的狀態，被鎖住時 locked = true，反之 false
    // 預設為 locked 狀態，歸還時也要自動讓鎖 locked
    bool public locked = true;
    
    // 事件們
    event Rented(address renter, uint lease, uint timestamp); // 當成功租用時的事件
    event InUse(address tryingrenter, address realrenter, uint timestamp); // 想要租用，然而這個鎖正在被使用中時的事件
    event NormalReturned(address renter, uint returneddeposit, uint timestamp); // 當成功正常歸還時的事件
    event Timeout(address renter, uint timestamp); // 當嘗試操作鎖或歸還時已經逾時的事件
    // 這邊暫時不用設計每一段時間以 web3.js 檢查是否逾期
    event Locked(address renter, uint timestamp); // 當成功鎖住鎖時的事件
    event Unlocked(address renter, uint timestamp); // 當成功解鎖鎖時的事件

    // 建構子
    function RentableLockService() {
        
    }
    
    // 租用鎖的函式
    // 已經被租用的鎖無法租用
    // 記得狀態的維護
    function rent() payable {
        // 透過 payable 轉換成時間去取得
        if (locked == true && renter != 0) {
            InUse(msg.sender, renter, now);
        } else if (renter == 0){
            locked = false;
            endTime = now + (msg.value / 10000000000000000);
            renter = msg.sender;
            Rented(renter, msg.value, now);
            lock();
        }
    }
    
    // 歸還鎖的函式
    // 記得管理是誰還
    // 假如在時間內歸還，會退還未使用金額至 renter
    // 假如未在時間內歸還，則任何操作發生時 (return_, lock, unlock) 則將會自動歸還並發射 Timeout 事件
    function return_() {
        // 計算餘額退還
        var remainTime = (endTime - now) / 1000;
        var remain = remainTime * 10 finney;
        if (endTime > now && renter == msg.sender) {
            NormalReturned(renter, remain, now);
            unlock();
        } else {
            Timeout(renter, now);
            unlock();
        }
    }
    
    // 鎖住鎖的函式
    // 記得管理是誰執行動作
    // 假如未在時間內歸還，則任何操作發生時 (return_, lock, unlock) 則將會自動歸還並發射 Timeout 事件
    function lock() {
        if (locked == false && renter == msg.sender) {
            locked = true;
            Locked(renter, now);
        } else {
            return_();
            Timeout(renter, now);
        }
    }
    
    // 解鎖鎖的函式
    // 記得管理是誰執行動作
    // 假如未在時間內歸還，則任何操作發生時 (return_, lock, unlock) 則將會自動歸還並發射 Timeout 事件
    function unlock() {
        if (locked == true && renter == msg.sender) {
            locked = false;
            Unlocked(renter, now);
        } else {
            return_();
            Timeout(renter, now);
        }
    }
}
