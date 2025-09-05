// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KreediaPayment {
    mapping(address => mapping(address => uint256)) public workerTotalEarned;
    struct LockedFunds {
        address token;
        uint256 amount;
        address ngo;
        bool locked;
    }

    mapping(address => bool) public acceptedTokens;
    mapping(string => LockedFunds) public missionFunds;

    event TokenAdded(address token);
    event TokenRemoved(address token);
    event MoneyLocked(string indexed missionId, address token, uint256 amount, address ngo);
    event MissionValidated(string indexed missionId);
    event RewardsDistributed(string indexed missionId, address reporter, address worker, address platform, uint256 reporterAmount, uint256 workerAmount, uint256 platformAmount);
    event PlatformFeesWithdrawn(address token, uint256 amount, address to);
    event MoneyUnlocked(string indexed missionId, address token, uint256 amount, address ngo);

    error InvalideAddress();
    error CustomError(string message);


    function addToken(address token) external {
        if (token == address(0)) revert CustomError("Invalide token address");
        if (acceptedTokens[token]) revert CustomError("Token already added");

        acceptedTokens[token] = true;
        emit TokenAdded(token);
    }

    function removeToken(address token) external {
        if (token == address(0)) revert InvalideAddress();
        if (!acceptedTokens[token]) revert CustomError("This token was never allowed");

        acceptedTokens[token] = false;
        emit TokenRemoved(token);
    }

    function lockFunds(string memory missionId, address token, uint256 amount) external {
        if (!acceptedTokens[token]) revert CustomError("The token you're trying to use is not accepted");
        if (amount <= 0) revert CustomError("Amount must be greater than zero");

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);

        if (!success) revert CustomError("Token transfer failed");
        missionFunds[missionId] = LockedFunds({token: token, amount: amount, ngo: msg.sender, locked: true});

        emit MoneyLocked(missionId, token, amount, msg.sender);
    }

    function unlockFunds(string memory missionId) external {
        LockedFunds storage lf = missionFunds[missionId];
        if (!lf.locked) revert CustomError("This mission don't have locked funds");
        

        bool success = IERC20(lf.token).transfer(lf.ngo, lf.amount);
        if (!success) revert CustomError("Token transfer failed");

        lf.locked = false;

        emit MoneyUnlocked(missionId, lf.token, lf.amount, lf.ngo);
    }

    function validateMission(
        string memory missionId,
        address reporter,
        address worker,
        address platform
    ) external {
        LockedFunds storage lf = missionFunds[missionId];

        if (reporter == address(0)) revert CustomError("Invalide reporter address");
        if (worker == address(0)) revert CustomError("Invalide worker address");
        if (platform == address(0)) revert CustomError("Invalide platform address");
        if (!lf.locked) revert CustomError("This mission don't have locked funds");
        
        uint256 total = lf.amount;
        uint256 reporterAmount = (total * 20) / 100;
        uint256 workerAmount = (total * 76) / 100;
        uint256 platformAmount = (total * 4) / 100;
        uint256 remainder = total - (reporterAmount + workerAmount + platformAmount);

        IERC20(lf.token).transfer(reporter, reporterAmount);
        IERC20(lf.token).transfer(worker, workerAmount);

        workerTotalEarned[worker][lf.token] += workerAmount;
        lf.locked = false;

        emit MissionValidated(missionId);
        emit RewardsDistributed(missionId, reporter, worker, address(this), reporterAmount, workerAmount, platformAmount + remainder);

    }

    function withdrawPlatformFees(address token, uint256 amount, address to) external {
        if (to == address(0)) revert CustomError("Invalide address");
        if (amount <= 0) revert CustomError("Amount must be greater than zero");

        uint256 platformBalance = IERC20(token).balanceOf(address(this));
        if (amount > platformBalance) revert CustomError("Insufficient platform fees");

        bool success = IERC20(token).transfer(to, amount);
        if (!success) revert CustomError("Token transfer failed");

        emit PlatformFeesWithdrawn(token, amount, to);
    }
}
