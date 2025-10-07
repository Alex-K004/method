'use strict';

const {
  Character,
  Bowman,
  Swordsman,
  Magician,
  Undead,
  Zombie,
  Daemon,
} = require('../src/characters');

describe('Character Classes', () => {
  describe('Base Character Class', () => {
    test('should create character with default values', () => {
      const char = new Bowman('Legolas');

      expect(char.name).toBe('Legolas');
      expect(char.type).toBe('Bowman');
      expect(char.health).toBe(100);
      expect(char.level).toBe(1);
      expect(char.attack).toBe(25);
      expect(char.defence).toBe(25);
    });

    test('should throw error for invalid name length (< 2)', () => {
      expect(() => new Bowman('A')).toThrow('Имя должно содержать от 2 до 10 символов');
    });

    test('should throw error for invalid name length (> 10)', () => {
      expect(() => new Bowman('VeryLongName123')).toThrow('Имя должно содержать от 2 до 10 символов');
    });

    test('should throw error for non-string name', () => {
      expect(() => new Bowman(123)).toThrow('Имя должно быть строкой');
      expect(() => new Bowman(null)).toThrow('Имя должно быть строкой');
      expect(() => new Bowman(undefined)).toThrow('Имя должно быть строкой');
      expect(() => new Bowman({})).toThrow('Имя должно быть строкой');
    });

    test('should throw error for invalid type', () => {
      expect(() => new Character('Test', 'InvalidType')).toThrow('Неверный тип персонажа');
    });

    test('should accept valid name boundaries', () => {
      expect(() => new Bowman('Ab')).not.toThrow();
      expect(() => new Bowman('ABCDEFGHIJ')).not.toThrow();
    });
  });

  describe('Character Types and Stats', () => {
    test('Bowman should have correct stats', () => {
      const bowman = new Bowman('Legolas');
      expect(bowman.attack).toBe(25);
      expect(bowman.defence).toBe(25);
    });

    test('Swordsman should have correct stats', () => {
      const swordsman = new Swordsman('Aragorn');
      expect(swordsman.attack).toBe(40);
      expect(swordsman.defence).toBe(10);
    });

    test('Magician should have correct stats', () => {
      const magician = new Magician('Gandalf');
      expect(magician.attack).toBe(10);
      expect(magician.defence).toBe(40);
    });

    test('Undead should have correct stats', () => {
      const undead = new Undead('Lich');
      expect(undead.attack).toBe(25);
      expect(undead.defence).toBe(25);
    });

    test('Zombie should have correct stats', () => {
      const zombie = new Zombie('Walker');
      expect(zombie.attack).toBe(40);
      expect(zombie.defence).toBe(10);
    });

    test('Daemon should have correct stats', () => {
      const daemon = new Daemon('Demon');
      expect(daemon.attack).toBe(10);
      expect(daemon.defence).toBe(40);
    });
  });

  describe('Level Up Method', () => {
    test('should increase level and stats by 20%', () => {
      const bowman = new Bowman('Legolas');
      bowman.levelUp();

      expect(bowman.level).toBe(2);
      expect(bowman.attack).toBe(30);
      expect(bowman.defence).toBe(30);
      expect(bowman.health).toBe(100);
    });

    test('should throw error when leveling up dead character', () => {
      const bowman = new Bowman('Legolas');
      bowman.health = 0;

      expect(() => bowman.levelUp()).toThrow('Нельзя повысить левел умершего');
    });

    test('should throw error when leveling up character with negative health', () => {
      const bowman = new Bowman('Legolas');
      bowman.health = -10;

      expect(() => bowman.levelUp()).toThrow('Нельзя повысить левел умершего');
    });

    test('should reset health to 100 after level up', () => {
      const bowman = new Bowman('Legolas');
      bowman.health = 50;
      bowman.levelUp();

      expect(bowman.health).toBe(100);
    });

    test('should work correctly with decimal values', () => {
      const magician = new Magician('Gandalf');
      magician.levelUp();

      expect(magician.attack).toBe(12);
      expect(magician.defence).toBe(48);
    });

    test('should work correctly for multiple level ups', () => {
      const swordsman = new Swordsman('Aragorn');
      swordsman.levelUp();
      swordsman.levelUp();

      expect(swordsman.level).toBe(3);
      expect(swordsman.health).toBe(100);
    });
  });

  describe('Damage Method', () => {
    test('should reduce health based on defence', () => {
      const bowman = new Bowman('Legolas');
      bowman.damage(40);

      expect(bowman.health).toBe(70);
    });

    test('should not reduce health below 0', () => {
      const bowman = new Bowman('Legolas');
      bowman.damage(200);

      expect(bowman.health).toBe(0);
    });

    test('should not damage dead character', () => {
      const bowman = new Bowman('Legolas');
      bowman.health = 0;
      bowman.damage(50);

      expect(bowman.health).toBe(0);
    });

    test('should calculate damage correctly for different defence values', () => {
      const swordsman = new Swordsman('Aragorn');
      swordsman.damage(50);

      expect(swordsman.health).toBe(55);
    });

    test('should calculate damage correctly for high defence', () => {
      const magician = new Magician('Gandalf');
      magician.damage(50);

      expect(magician.health).toBe(70);
    });

    test('should handle zero damage', () => {
      const bowman = new Bowman('Legolas');
      const initialHealth = bowman.health;
      bowman.damage(0);

      expect(bowman.health).toBe(initialHealth);
    });

    test('should handle negative damage (no effect)', () => {
      const bowman = new Bowman('Legolas');
      const initialHealth = bowman.health;
      bowman.damage(-10);

      expect(bowman.health).toBe(initialHealth);
    });

    test('should work with decimal damage values', () => {
      const bowman = new Bowman('Legolas');
      bowman.damage(33.33);

      expect(bowman.health).toBeCloseTo(75);
    });
  });

  describe('Integration: Level Up and Damage', () => {
    test('level up should work after taking damage', () => {
      const bowman = new Bowman('Legolas');
      bowman.damage(40);
      bowman.levelUp();

      expect(bowman.level).toBe(2);
      expect(bowman.health).toBe(100);
      expect(bowman.attack).toBe(30);
    });

    test('damage calculation should use updated stats after level up', () => {
      const bowman = new Bowman('Legolas');
      bowman.levelUp();
      bowman.damage(40);

      expect(bowman.health).toBe(72);
    });
  });

  describe('All Character Types Creation', () => {
    test('should create all character types without errors', () => {
      expect(() => new Bowman('Bowman')).not.toThrow();
      expect(() => new Swordsman('Swordsman')).not.toThrow();
      expect(() => new Magician('Magician')).not.toThrow();
      expect(() => new Undead('Undead')).not.toThrow();
      expect(() => new Zombie('Zombie')).not.toThrow();
      expect(() => new Daemon('Daemon')).not.toThrow();
    });

    test('all characters should inherit from Character', () => {
      const bowman = new Bowman('Test');
      expect(bowman instanceof Character).toBe(true);

      const swordsman = new Swordsman('Test');
      expect(swordsman instanceof Character).toBe(true);
    });
  });
});
