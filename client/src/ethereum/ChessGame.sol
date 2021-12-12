// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
contract ChessGame {
    
    struct game {
        
        IERC20  token1Address;
        IERC20  token2Address;
    
        mapping (address=> IERC20)  playerTokens;
    
        mapping(address=> uint )  playerTokenCount;
    
        uint  token1Amount;
        uint token2Amount;
        uint  usd_value;
        uint player_count;
    }
    
    mapping(string => uint) public urlGameidtocontractGamid; 

    mapping (uint => game)  public activeGames;
    
    event tokensStaked(address indexed _player,uint _tokens, address _stakingToken,uint indexed _game_id );
    
    uint public game_id=1;
    
    function createMatch(address _stakingToken,address _player_1,uint _tokens,uint _usd_value,string memory urlgame_id) public {
        
        game storage g=activeGames[game_id];
        //game(_stakingToken,_player_1,_tokens,_usd_value,game_id);
        g.token1Address=IERC20(_stakingToken);
        g.playerTokens[_player_1]=g.token1Address;
        g.playerTokenCount[_player_1]=_tokens;
        g.token1Amount=_tokens;
        g.usd_value=_usd_value;
        g.player_count=1;

        urlGameidtocontractGamid[urlgame_id]=game_id;

        game_id+=1;

        g.token1Address.transferFrom(_player_1, address(this), _tokens);
        emit tokensStaked(_player_1,_tokens,_stakingToken,game_id);
    }
    
    function addPlayer2(address _stakingToken,uint _game_id,uint _tokens,address _player_2) public {
        
        game storage g=activeGames[_game_id];
        g.token2Address=IERC20(_stakingToken);
        g.playerTokens[_player_2]=g.token2Address;
        g.playerTokenCount[_player_2]=_tokens;
        g.token2Amount=_tokens;
        g.player_count=2;
        g.token2Address.transferFrom(_player_2, address(this), _tokens);
        emit tokensStaked(_player_2,_tokens,_stakingToken,_game_id);
        //g.setPlayer2Token(_stakingToken,_tokens,_player_2,_game_id);
    }
    
    function withdrawAmount(address _player,uint _game_id) public {
        
        game storage g=activeGames[_game_id];
        g.playerTokens[_player].transfer(_player, g.playerTokenCount[_player]);
        //g.withdraw(_player);
    }
    
    function transferWinnerAmount(address _winner,uint _game_id) public {
        
        game storage g=activeGames[_game_id];
        g.token1Address.transfer(_winner, g.token1Amount);
        g.token2Address.transfer(_winner,g.token2Amount);
        //g.getReward(_winner);
    }
}