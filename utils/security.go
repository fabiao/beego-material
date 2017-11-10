package utils

import (
	"encoding/hex"
	"golang.org/x/crypto/scrypt"
	"math/rand"
)

const (
	SALT_LENGTH = 16
	ITERATIONS  = 32768
	R           = 8
	P           = 1
	KEY_LEN     = 64
)

func GenerateRandomBytes(length int) ([]byte, error) {
	salt := make([]byte, length)
	_, err := rand.Read(salt)
	if err != nil {
		return nil, err
	}
	return salt, nil
}

func scrypt2Hash(clearPassword string, salt []byte) ([]byte, error) {
	return scrypt.Key([]byte(clearPassword), salt, ITERATIONS, R, P, KEY_LEN)
}

func HashAndSalt(src string) (hashHex string, saltHex string, err error) {
	salt, err := GenerateRandomBytes(SALT_LENGTH)
	if err != nil {
		return "", "", err
	}

	hash, err := scrypt2Hash(src, salt)
	if err != nil {
		return "", "", err
	}

	hashHex = hex.EncodeToString(hash)
	saltHex = hex.EncodeToString(salt)

	return hashHex, saltHex, nil
}

func VerifyHash(src string, hash string, salt string) (bool, error) {
	saltBytes, err := hex.DecodeString(salt)
	if err != nil {
		return false, err
	}

	srcHash, err := scrypt2Hash(src, saltBytes)
	if err != nil {
		return false, err
	}

	srcHashHex := hex.EncodeToString(srcHash)
	return srcHashHex == hash, nil
}
