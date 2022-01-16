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
    struct HomeCard{
        string titre;
        uint id;
    }

    event eventcreated(id);
    event donnated(uint montant);
    function createvent(string memory titre, string memory description, uint objectif) public {
        uint idnevent = eventid;
        address eventcreat = msg.sender;
        donevent memory newdonevent = donevent(titre, description, objectif, 0, id_newdonevent, true, eventcreat);

        donnations[id_newdonevent] = newdonevent;

        eventid +=1;

        emit eventcreated(id_newdonevent);
    }

    function donate(uint id_event) public payable {
        donevent storage donnation = donnations[id_event];
        uint montant = msg.valeur;
        donnation.actuel = donnation.actuel + montant;

        emit donated(montant);
    }
    function retirer(uint id_event) public{
        address payable retireaccounts = payable(msg.sender);
        donevent storage donnation = donnations[id_event];

        require(retirecompte == donnation.creator);
        retirecompte.transfer(donnation.actuel);
        donnation.status = false;
    }
    
    function getdataHome() public view returns (HomeCard[] memory) {
        HomeCard[] memory cards = new HomeCard[](eventid);
        for (uint i = 0; i < eventid, i++){
            HomeCard memory homeCard = HomeCard(donnation[i].title, i);
            cards[i] = homeCard;
        }
        return cards;
    } 
}