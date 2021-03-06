'use strict';

var _ = require('lodash')
    , utils = require('../../../shared/utils')
    , ComponentBase = require('../../../shared/components/player')
    , PlayerComponent;

/**
 * Player component class.
 * @class server.components.PlayerComponent
 * @classdesc Component that adds player functionality.
 * @extends shared.core.Component
 */
PlayerComponent = utils.inherit(ComponentBase, {
    /**
     * Creates a new component.
     * @constructor
     * @param {server.core.Team} team - Team instance.
     */
    constructor: function(team) {
        ComponentBase.apply(this);

        // internal properties
        this._team = team;
        this._points = 0;
        this._kills = 0;
        this._deaths = 0;
        this._respawnSec = null;
        this._lastDeadAt = null;
    }
    /**
     * @override
     */
    , init: function() {
        this._team.addPlayer(this.owner);

        this._respawnSec = this.owner.attrs.get('respawnSec');

        // set initial entity attributes
        this.owner.attrs.set({
            team: this._team.name
            , teamColor: this._team.color
            , image: 'knight-' + this._team.name
        });

        this.spawn();

        this.owner.on('entity.kill', this.onEntityKill.bind(this));
        this.owner.on('entity.die', this.onEntityDeath.bind(this));
        this.owner.on('player.receivePoints', this.onPlayerReceivePoints.bind(this));
    }
    /**
     * Event handler for when the entity kills another entity.
     * @method server.components.PlayerComponent#onEntityKill
     */
    , onEntityKill: function(other) {
        this._kills++;
        this.addPoints(10);
    }
    /**
     * Event handler for when the entity dies.
     * @method server.components.PlayerComponent#onEntityDeath
     */
    , onEntityDeath: function() {
        this._deaths++;
        this._lastDeadAt = _.now();
    }
    /**
     * Event handler for when awarding player points.
     * @method server.components.PlayerComponent#onPlayerAwardPoints
     */
    , onPlayerReceivePoints: function(points) {
        this.addPoints(points);
    }
    /**
     * TODO
     */
    , addPoints: function(amount) {
        this._points += amount;
        this._team.points += amount;
    }
    /**
     * Spawns the player in the team base.
     * @method server.components.Player#spawn
     */
    , spawn: function() {
        var position = this._team.spawnPosition();
        this.owner.attrs.set({x: position.x, y: position.y});
    }
    /**
     * @override
     */
    , update: function(elapsed) {
        if (this.canRevive()) {
            this.spawn();
            this.owner.revive();
            this._lastDeadAt = null;
        }

        // update entity attributes
        this.owner.attrs.set({
            points: this._points
            , kills: this._kills
            , deaths: this._deaths
            , lastDeadAt: this._lastDeadAt
        });
    }
    /**
     * Returns whether the entity can be revived.
     * @method server.components.PlayerComponent#canRevive
     * @return {boolean} The result.
     */
    , canRevive: function() {
        return this._lastDeadAt !== null && (_.now() - this._lastDeadAt) > (this._respawnSec * 1000);
    }
});

module.exports = PlayerComponent;
