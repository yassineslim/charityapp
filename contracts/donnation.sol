// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract donnation {
    uint public eventid = 0;
    mapping (uint => donevent) public donnations;

    struct donevent {
        string titre;
        string description;
        uint objectif;
        uint actuel;
        uint id;
        bool status;
        address createur;
    }

    function createvent(string memory titre, string memory description, uint objectif) public {
        
    }
}