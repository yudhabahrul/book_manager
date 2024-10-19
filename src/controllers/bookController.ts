import { Request, Response } from "express";
import Book from "../models/book.js";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan" });
  }
};

export const addBook = async (req: Request, res: Response) => {
  const { title, author, description } = req.body;
  try {
    const newBook = await Book.create({ title, author, description });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Tidak dapat menambahkan buku" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const { title, author, description } = req.body;
  const bookId = req.params.id;
  try {
    const book = await Book.findByPk(bookId);
    if (book) {
      book.title = title;
      book.author = author;
      book.description = description;
      await book.save();
      res.json(book);
    } else {
      res.status(404).json({ error: "Buku tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: "Tidak dapat memperbarui buku" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const bookId = req.params.id;
  try {
    const book = await Book.findByPk(bookId);
    if (book) {
      await book.destroy();
      res.json({ message: "Buku berhasil dihapus" });
    } else {
      res.status(404).json({ error: "Buku tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ error: "Tidak dapat menghapus buku" });
  }
};
